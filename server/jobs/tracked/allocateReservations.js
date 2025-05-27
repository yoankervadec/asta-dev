//
// server/jobs/tracked/allocateReservations.js

import { getConnection } from "../../back-end/configs/db.config.js";

export const allocateReservations = async (orderNo = null, itemNo = null) => {
  const connection = await getConnection();

  try {
    const startTime = performance.now();
    await connection.beginTransaction();

    // DROP THEN CREATE TEMP TABLE TO HOLD CUSTOMER ORDERS
    await connection.query(
      `
      DROP TEMPORARY TABLE IF EXISTS temp_order_lines;
      `
    );
    await connection.query(
      `
      CREATE TEMPORARY TABLE temp_order_lines(
        order_no INT NOT NULL,
        line_no INT NOT NULL,
        item_no VARCHAR(255) NOT NULL,
        attribute_group VARCHAR(255) NOT NULL COLLATE utf8mb4_unicode_ci,
        quantity_ordered INT NOT NULL,
        quantity_reserved INT NOT NULL,
        status INT NOT NULL,
        priority INT NOT NULL,
        required_date DATE,
        created_at DATE,
        calculated_priority INT NOT NULL
      );
      `
    );

    // FETCH, SORT AND INSERT PENDING ORDERS INTO TEMP TABLE
    await connection.query(
      `
      INSERT INTO temp_order_lines
      SELECT
        ol.order_no,
        ol.line_no,
        ol.item_no,
        GROUP_CONCAT (
          DISTINCT la.attr_id
          ORDER BY
            la.attr_id SEPARATOR ','
        ) AS attribute_group,
        ol.quantity AS quantity_ordered,
        COALESCE(re.quantity_reserved, 0) AS quantity_reserved,
        ol.status,
        o.priority,
        o.required_date,
        o.created_at,
        ROW_NUMBER() OVER (
          PARTITION BY
            ol.item_no,
            ol.line_no
          ORDER BY
            o.priority DESC,
            o.required_date ASC,
            o.created_at ASC
        ) AS calculated_priority
      FROM
        orders_list AS ol
        JOIN orders AS o ON ol.order_no = o.order_no
        JOIN orders_list_line_attr AS la ON ol.line_no = la.line_no
        AND ol.order_no = la.order_no
        JOIN products_attr AS pa ON la.attr_id = pa.attr_id
        LEFT JOIN (
          SELECT
            order_no,
            line_no,
            SUM(quantity_reserved) AS quantity_reserved
          FROM
            reservation_entries
          GROUP BY
            order_no,
            line_no
        ) AS re ON ol.order_no = re.order_no
        AND ol.line_no = re.line_no
      WHERE
        o.quote = 0
        AND o.posted = 0
        AND ol.active = 1
        AND ol.shipped = 0
        AND ol.posted = 0
      GROUP BY
        ol.order_no,
        ol.line_no
      ORDER BY
        calculated_priority;
      `
    );

    // FIND CONFLICT LINES
    const [conflictOrders] = await connection.query(
      `
      SELECT
        COALESCE(p.order_no, t.order_no) AS order_no,
        COALESCE(p.line_no, t.line_no) AS line_no,
        t.item_no,
        t.quantity_ordered AS quantity,
        t.required_date,
        t.priority,
        t.calculated_priority AS current_priority,
        p.order_priority AS previous_priority
      FROM
        orders_list_priority AS p
        LEFT JOIN temp_order_lines AS t ON p.order_no = t.order_no
        AND p.line_no = t.line_no
      WHERE
        -- Case 1: priority has increased
        (
          t.calculated_priority IS NOT NULL
          AND t.calculated_priority > p.order_priority
        )
        -- Case 2: old priority exists but no matching line anymore
        OR (t.order_no IS NULL)
      `
    );

    // DELETE CONFLICT LINES
    if (conflictOrders.length > 0) {
      const removeConflictsQuery = `
        DELETE FROM
          reservation_entries
        WHERE
          (order_no, line_no) IN
          (${conflictOrders.map(() => `(?, ?)`).join(", ")})     
      `;
      const params = conflictOrders.flatMap(({ order_no, line_no }) => [
        order_no,
        line_no,
      ]);
      await connection.query(removeConflictsQuery, params);
    }

    // FETCH AVAILABLE INVENTORY
    const [inventory] = await connection.query(
      `
      SELECT
        inv.item_no,
        inv.attr_id_set_as_string,
        inv.actual_inventory,
        COALESCE(res.quantity_reserved, 0) AS reserved_inventory,
        GREATEST (
          inv.actual_inventory - COALESCE(res.quantity_reserved, 0),
          0
        ) AS available_inventory
      FROM
        (
          -- Actual inventory per item + attr group
          SELECT
            ie.item_no,
            COALESCE(SUM(ie.quantity), 0) AS actual_inventory,
            attr_group.attr_id_set_as_string
          FROM
            item_entries AS ie
            JOIN (
              SELECT
                ie1.entry_no,
                GROUP_CONCAT (
                  DISTINCT ie_attr.attr_id
                  ORDER BY
                    ie_attr.attr_id SEPARATOR ','
                ) AS attr_id_set_as_string
              FROM
                item_entries AS ie1
                JOIN item_entries_attr AS ie_attr ON ie1.entry_no = ie_attr.entry_no
              GROUP BY
                ie1.entry_no
            ) AS attr_group ON ie.entry_no = attr_group.entry_no
          GROUP BY
            ie.item_no,
            attr_group.attr_id_set_as_string
        ) AS inv
        -- Reserved inventory per item + attr group
        LEFT JOIN (
          SELECT
            item_no,
            attribute_group,
            SUM(quantity_reserved) AS quantity_reserved
          FROM
            temp_order_lines
          GROUP BY
            item_no,
            attribute_group
        ) AS res ON inv.item_no = res.item_no
        AND inv.attr_id_set_as_string = res.attribute_group
      `
    );

    // FETCH CUSTOMER ORDERS FROM TEMP TABLE
    const [orders] = await connection.query(
      `
      SELECT
        order_no,
        line_no,
        item_no,
        attribute_group,
        quantity_ordered,
        quantity_reserved
      FROM
        temp_order_lines
      `
    );

    // Helper function to create a key for the item + attribute group
    const makeKey = (itemNo, attributeGroup) => `${itemNo}::${attributeGroup}`;

    // BUILD AN ATTRIBUTE LEVEL INVENTORY MAP
    const inventoryMap = new Map();
    for (const row of inventory) {
      const { item_no, attr_id_set_as_string, available_inventory } = row;

      const itemKey = makeKey(item_no, attr_id_set_as_string);

      if (!inventoryMap.has(itemKey))
        inventoryMap.set(itemKey, available_inventory);
    }

    // LOOP OVER ORDER LINES AND ALLOCATE
    const newReservations = [];

    for (const order of orders) {
      const {
        order_no,
        line_no,
        item_no,
        attribute_group,
        quantity_ordered,
        quantity_reserved,
      } = order;

      // Calculate the quantity needed for reservation
      const needed = quantity_ordered - quantity_reserved;
      if (needed <= 0) continue;

      // Create the key for the current order line
      const itemKey = makeKey(item_no, attribute_group);

      // Check available inventory for this key
      const availableInventory = inventoryMap.get(itemKey);
      if (!availableInventory || availableInventory <= 0) continue;

      // Allocate inventory based on available quantity
      const allocated = Math.min(needed, availableInventory);

      // Push reservation to reservations array
      newReservations.push({
        order_no,
        line_no,
        item_no,
        attribute_group,
        quantity_reserved: allocated,
      });

      // Update the inventory map by substracting the allocated quantity
      inventoryMap.set(itemKey, availableInventory - allocated);
    }

    console.log(newReservations);

    // INSERT NEW RESERVATION ENTRIES
    let entries = { affectedRows: 0 };

    if (newReservations.length > 0) {
      const query = `
      INSERT INTO
        reservation_entries (
          order_no,
          line_no,
          quantity_reserved
        )
      VALUES
        ${newReservations.map(() => `(?, ?, ?)`).join(", ")}
      `;

      const params = newReservations.flatMap((r) => [
        r.order_no,
        r.line_no,
        r.quantity_reserved,
      ]);

      const insertResult = await connection.query(query, params);
      entries = insertResult[0];
    }

    // DELETE AND INSERT PRIORITY ORDER FOR NEXT RUN
    await connection.query(
      `
      DELETE FROM orders_list_priority
      `
    );
    await connection.query(
      `
      INSERT INTO orders_list_priority (
        order_no,
        line_no,
        item_no,
        quantity,
        order_priority
      )
      SELECT
        order_no,
        line_no,
        item_no,
        quantity_ordered AS quantity,
        calculated_priority
      FROM
        temp_order_lines
      `
    );

    connection.commit();
    // connection.rollback();
    const endTime = performance.now();

    return {
      rowsDeleted: conflictOrders.length,
      rowsInserted: entries.affectedRows,
      executionTime: `${(endTime - startTime).toFixed(2)} ms`,
    };
  } catch (error) {
    await connection.rollback();
    console.error(error);
  } finally {
    connection.release();
  }
};
