//
// server/back-end/models/products/selectProductsWithAttributes.js

import { query } from "../../configs/db.config.js";

export const selectProductsWithAttributes = async (itemNo = null) => {
  try {
    let sql = `
      SELECT
        inv.item_no,
        inv.description,
        inv.attr_id_set_as_string,
        inv.attr_name_set_as_string,
        inv.attr_as_array,
        inv.actual_inventory,
        COALESCE(res.quantity_reserved, 0) AS reserved_inventory,
        GREATEST(
          inv.actual_inventory - COALESCE(res.quantity_reserved, 0),
          0
        ) AS available_inventory
      FROM (
        -- Subquery for actual inventory
        SELECT
          ie.item_no,
          pr.description,
          COALESCE(SUM(ie.quantity), 0) AS actual_inventory,
          attr_group.attr_id_set_as_string,
          attr_group.attr_name_set_as_string,
          attr_group.attr_as_array
        FROM
          item_entries AS ie
        JOIN
          products AS pr ON ie.item_no = pr.item_no
        JOIN (
          SELECT
            ie1.entry_no,
            GROUP_CONCAT(
              DISTINCT ie_attr.attr_id ORDER BY ie_attr.attr_id SEPARATOR ', '
            ) AS attr_id_set_as_string,
            GROUP_CONCAT(
              DISTINCT pa.attr_name ORDER BY ie_attr.attr_id SEPARATOR ', '
            ) AS attr_name_set_as_string,
            COALESCE(
              JSON_ARRAYAGG(
                JSON_OBJECT(
                  'attrId', pa.attr_id,
                  'attrName', pa.attr_name
                )
              ),
              '[]'
            ) AS attr_as_array
          FROM
            item_entries AS ie1
          JOIN
            item_entries_attr AS ie_attr ON ie1.entry_no = ie_attr.entry_no
          JOIN
            products_attr AS pa ON ie_attr.attr_id = pa.attr_id
          GROUP BY
            ie1.entry_no
        ) AS attr_group ON ie.entry_no = attr_group.entry_no
        GROUP BY
          ie.item_no,
          pr.description,
          attr_group.attr_id_set_as_string,
          attr_group.attr_name_set_as_string,
          attr_group.attr_as_array
      ) AS inv
      LEFT JOIN (
        -- Subquery for reserved inventory
        SELECT
          ol.item_no,
          COALESCE(SUM(re.quantity_reserved), 0) AS quantity_reserved,
          attr_group.attr_id_set_as_string
        FROM
          reservation_entries AS re
        JOIN
          orders_list AS ol ON re.order_no = ol.order_no AND re.line_no = ol.line_no
        JOIN (
          SELECT
            ol_attr.order_no,
            ol_attr.line_no,
            GROUP_CONCAT(
              DISTINCT ol_attr.attr_id ORDER BY ol_attr.attr_id SEPARATOR ', '
            ) AS attr_id_set_as_string,
            COALESCE(
              JSON_ARRAYAGG(
                JSON_OBJECT(
                  'attrId', pa.attr_id,
                  'attrName', pa.attr_name
                )
              ),
              '[]'
            ) AS attr_as_array
          FROM
            orders_list_line_attr AS ol_attr
          JOIN
            products_attr AS pa ON ol_attr.attr_id = pa.attr_id
          GROUP BY
            ol_attr.order_no,
            ol_attr.line_no
        ) AS attr_group ON ol.order_no = attr_group.order_no
                      AND ol.line_no = attr_group.line_no
        GROUP BY
          ol.item_no,
          attr_group.attr_id_set_as_string
      ) AS res ON inv.item_no = res.item_no
              AND inv.attr_id_set_as_string = res.attr_id_set_as_string
    `;

    // Add conditions dynamically
    const conditions = [];
    const params = [];

    if (itemNo !== null) {
      conditions.push("inv.item_no = ?");
      params.push(itemNo);
    }

    // Append WHERE clause if conditions exist
    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(" AND ")}`;
    }

    // Add ORDER BY clause
    sql += `
      ORDER BY
        inv.item_no,
        inv.attr_id_set_as_string
    `;

    // Execute
    const result = await query(sql, params);
    return result;
  } catch (error) {
    throw new Error(
      "Failed to Select Products with Attributes: " + error.message
    );
  }
};
