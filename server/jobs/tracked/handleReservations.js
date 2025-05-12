//
// server/jobs/handleReservations.js

import { getConnection } from "../../back-end/configs/db.config.js";

export const handleReservations = async () => {
  const connection = await getConnection();

  try {
    const startTime = performance.now();
    await connection.beginTransaction();

    // Step 1.1: Create TEMP table
    await connection.query(
      `
      DROP TEMPORARY TABLE IF EXISTS temp_order_priority;

      CREATE TEMPORARY TABLE temp_order_priority(
        order_no INT NOT NULL,
        line_no INT NOT NULL,
        item_no VARCHAR(255) NOT NULL,
        quantity_required INT NOT NULL,
        quantity_reserved INT NOT NULL,
        priority INT NOT NULL,
        required_date DATE,
        order_priority INT NOT NULL
      )
      `
    );

    // Step 1.2: Insert into TEMP table
    await connection.query(
      `
      INSERT INTO temp_order_priority
      SELECT
        ol.order_no,
        ol.line_no,
        ol.item_no,
        ol.quantity AS quantity_required,
        COALESCE(SUM(re.quantity_reserved),0) AS quantity_reserved,
        o.priority,
        o.required_date,
        ROW_NUMBER() OVER (
        PARTITION BY
          ol.item_no
        ORDER BY
          o.priority DESC,
          o.required_date ASC,
          o.created_at ASC
      ) AS order_priority
      FROM
        orders_list AS ol
      JOIN
        orders AS o ON ol.order_no = o.order_no
      LEFT JOIN
        reservation_entries AS re ON ol.order_no = re.order_no
        AND ol.line_no = re.line_no
      WHERE
        o.quote = 0         -- not a quote
        AND o.posted = 0    -- not posted order
        AND ol.active = 1   -- not canceled line
        AND ol.posted = 0   -- not posted line
        AND ol.shipped = 0  -- not shipped
      GROUP BY
        ol.order_no,
        ol.line_no,
        re.order_no,
        re.line_no
      ORDER BY
        order_priority
      `
    );

    // Step 2: Delete conflict lines
    // orders with different priority from the previous cycle or shipped/canceled
    const [conflictOrders] = await connection.query(
      `
      WITH sorted_orders AS (
        SELECT
          ol.order_no,
          ol.line_no,
          ol.item_no,
          ol.quantity,
          o.required_date,
          o.priority,
          ROW_NUMBER() OVER (
            PARTITION BY ol.item_no
            ORDER BY o.priority DESC, o.required_date ASC, o.created_at ASC
          ) AS order_priority
        FROM
          orders_list AS ol
        JOIN
          orders AS o
          ON ol.order_no = o.order_no
        WHERE
          o.quote = 0
          AND o.posted = 0
          AND ol.active = 1
          AND ol.posted = 0
          AND ol.shipped = 0
      )
      SELECT
        s.order_no,
        s.line_no,
        s.item_no,
        s.quantity,
        s.required_date,
        s.priority,
        s.order_priority AS current_priority,
        p.order_priority AS previous_priority
      FROM
        sorted_orders AS s
      LEFT JOIN
        orders_list_priority AS p
        ON s.order_no = p.order_no AND s.line_no = p.line_no
      WHERE
        s.order_priority > p.order_priority
        -- new priority higner than previous
      UNION
      SELECT
        p.order_no,
        p.line_no,
        NULL AS item_no,
        NULL AS quantity,
        NULL AS required_date,
        NULL AS priority,
        NULL AS current_priority,
        p.order_priority AS previous_priority
      FROM
        orders_list_priority AS p
      LEFT JOIN
        sorted_orders AS s
        ON p.order_no = s.order_no AND p.line_no = s.line_no
      WHERE
        s.order_no IS NULL;
      `
    );
    // Delete reservation entries lines for the order_no + line_no returned
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

    await connection.query(
      `
      DELETE FROM orders_list_priority
      `
    );

    // Step 3: get available inventory based on ledgers and reservation entries
    // (refunds + production + positive adjustments) - (sales + negative adjustments) - (quantities reserved)
    const [inventory] = await connection.query(
      `
      SELECT
          ie.item_no,
          GREATEST(
              (
                  SUM(
                      CASE
                          WHEN ie.TYPE IN (2, 3, 4) THEN ie.quantity
                          ELSE 0
                      END
                  ) - SUM(
                      CASE
                          WHEN ie.TYPE IN (1, 5) THEN ie.quantity
                          ELSE 0
                      END
                  )
              ) - COALESCE(re.sum_quantity, 0), 0
          ) AS available_inventory
      FROM item_entries ie
          LEFT JOIN (
              SELECT
                  ol.item_no,
                  GREATEST(SUM(re.quantity_reserved), 0) AS sum_quantity
              FROM
                  reservation_entries AS re
                  JOIN
                      orders_list AS ol ON re.order_no = ol.order_no
                      AND re.line_no = ol.line_no
              GROUP BY
                  ol.item_no
          ) AS re ON ie.item_no = re.item_no
      GROUP BY
          ie.item_no
      `
    );
    // Create inventory map
    const inventoryMap = new Map();
    inventory.forEach((item) => {
      inventoryMap.set(item.item_no, item.available_inventory);
    });

    // Step 4: Get orders from temp table
    const [orders] = await connection.query(
      `
      SELECT
        order_no,
        line_no,
        item_no,
        quantity_required,
        quantity_reserved,
        priority,
        required_date,
        order_priority
      FROM
        temp_order_priority
      `
    );

    // Step 5: Allocate inventory to orders
    const newReservations = [];

    for (const order of orders) {
      const {
        order_no,
        line_no,
        item_no,
        quantity_required,
        quantity_reserved,
      } = order;

      const remainingNeeded = quantity_required - quantity_reserved;
      if (remainingNeeded <= 0) continue; // Skip if already fully reserved

      const availableInventory = inventoryMap.get(item_no) || 0;
      if (availableInventory <= 0) continue; // Skip if no inventory left

      // Determine how much can be allocated
      const allocatedQuantity = Math.min(remainingNeeded, availableInventory);

      // Store new reservation entry
      newReservations.push([order_no, line_no, allocatedQuantity]);

      // Update inventory map
      inventoryMap.set(item_no, availableInventory - allocatedQuantity);
    }

    // Step 6: Insert new reservation entries
    let entries = { affectedRows: 0 };

    if (newReservations.length > 0) {
      const insertReservationQuery = `
        INSERT INTO reservation_entries (
          order_no,
          line_no,
          quantity_reserved  
        )
        VALUES
          ${newReservations.map(() => `(?, ?, ?)`).join(", ")}
      `;
      const params = newReservations.flat();
      const insertResult = await connection.query(
        insertReservationQuery,
        params
      );
      entries = insertResult[0];
    }

    // Step 7: Log priority list for next run
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
        quantity_required AS quantity,
        order_priority
      FROM
        temp_order_priority
      `
    );

    await connection.commit();
    const endTime = performance.now();

    return {
      rowsDeleted: conflictOrders.length,
      rowsInserted: entries.affectedRows,
      executionTime: `${(endTime - startTime).toFixed(2)} ms`,
    };
  } catch (error) {
    await connection.rollback();
    console.error(error);
    throw new Error("Scheduler job failed: " + error.message);
  } finally {
    connection.release();
  }
};
