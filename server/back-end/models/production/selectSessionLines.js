//
// server/back-end/models/production/selectSessionLines.js

import { query } from "../../configs/db.config.js";

export const selectSessionLines = async (
  sessionNo = null,
  itemNo = null,
  posted = null
) => {
  try {
    let sql = `
      SELECT
        sl.line_no,
        sl.session_no,
        sh.posted,
        sl.item_no,
        sl.quantity,
        sl.reserved_for_order_no,
        sl.reserved_for_order_line_no,
        sl.created_at,
        sl.created_by,
        u.name AS created_by_name,
        GROUP_CONCAT(pa.attr_name SEPARATOR ', ') AS attr_name_as_string,
        GROUP_CONCAT(pa.attr_id SEPARATOR ', ') AS attr_id_as_string,
          COALESCE(
          JSON_ARRAYAGG(
            JSON_OBJECT('attr_id', pa.attr_id, 'attr_name', pa.attr_name)
          ), '[]'
        ) AS attr_as_array
      FROM
        work_session_lines AS sl
      JOIN
        work_session_line_attr AS la ON sl.line_no = la.line_no
        AND sl.session_no = la.session_no
      JOIN
        work_session_header AS sh ON sl.session_no = sh.session_no
      JOIN
        products_attr AS pa ON la.attr_id = pa.attr_id
      JOIN
        users AS u ON sl.created_by = u.user_id
    `;
    // Add conditions dynamically
    const conditions = [];
    const params = [];

    if (sessionNo !== null) {
      conditions.push("sl.session_no = ?");
      params.push(sessionNo);
    }
    if (itemNo !== null) {
      conditions.push("sl.item_no = ?");
      params.push(itemNo);
    }
    if (posted !== null) {
      conditions.push("sh.posted = ?");
      params.push(posted);
    }

    // Append WHERE clause if conditions exist
    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(" AND ")}`;
    }

    sql += `
    GROUP BY
      sl.line_no,
      sl.session_no
    ORDER BY
      line_no DESC
      `;

    const result = await query(sql, params);
    return result;
  } catch (error) {
    throw new Error("Failed to select Session Lines: " + error.message);
  }
};
