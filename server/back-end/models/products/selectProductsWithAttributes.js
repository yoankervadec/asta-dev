//
// server/back-end/models/products/selectProductsWithAttributes.js

import { query } from "../../configs/db.config.js";

export const selectProductsWithAttributes = async (itemNo = null) => {
  try {
    let sql = `
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
    `;

    // Add conditions dynamically
    const conditions = [];
    const params = [];

    if (itemNo !== null) {
      conditions.push("ie.item_no = ?");
      params.push(itemNo);
    }

    // Append WHERE clause if conditions exist
    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(" AND ")}`;
    }

    // Add ORDER BY clause
    sql += `
      GROUP BY
        ie.item_no,
        pr.description,
        attr_group.attr_id_set_as_string,
        attr_group.attr_name_set_as_string,
        attr_group.attr_as_array
      ORDER BY
          ie.item_no,
          attr_group.attr_id_set_as_string
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
