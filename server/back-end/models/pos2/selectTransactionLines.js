//
// server/back-end/models/pos2/selectTransactionLines.js

import { query } from "../../configs/db.config.js";

export const selectTransactionLines = async (createdBy) => {
  try {
    const result = await query(
      `
      SELECT
        tl.line_no,
        tl.whs_id,
        wl.whs_name,
        tl.item_no,
        pr.description,
        GROUP_CONCAT(
          DISTINCT la.attr_id
          ORDER BY la.attr_id SEPARATOR ', '
        ) AS attr_id_set_as_string,
        GROUP_CONCAT(
          DISTINCT pa.attr_name
          ORDER BY la.attr_id SEPARATOR ', '
        ) AS attr_name_set_as_string,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'attrId', la.attr_id,
            'attrName', pa.attr_name
          )
        ) AS attr_as_array,
        pr.thickness,
        pr.width,
        pr.length,
        tl.quantity,
        tl.unit_price,
        tl.disc_perc,
        tl.created_at,
        tl.created_by,
        u.name AS created_by_name
      FROM
        transaction_lines AS tl
      JOIN
        products AS pr ON tl.item_no = pr.item_no
      JOIN
        warehouse_locations AS wl ON tl.whs_id = wl.whs_id
      JOIN
        transaction_lines_attr AS la ON tl.line_no = la.line_no
        AND tl.created_by = la.created_by
      JOIN
        products_attr AS pa ON la.attr_id = pa.attr_id
      JOIN
        users AS u ON tl.created_by = u.user_id
      WHERE
        tl.created_by = ?
      GROUP BY
        tl.line_no,
        tl.whs_id,
        wl.whs_name,
        tl.item_no,
        pr.description,
        pr.thickness,
        pr.width,
        pr.length,
        tl.quantity,
        tl.unit_price,
        tl.disc_perc,
        tl.created_at,
        tl.created_by
      `,
      [createdBy]
    );

    return result;
  } catch (error) {
    throw new Error(`Failed to select Transaction Lines: ${error.message}`);
  }
};
