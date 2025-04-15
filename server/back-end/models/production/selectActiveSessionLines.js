//
// server/back-end/models/production/selectActiveSessionLines.js

import { query } from "../../configs/db.config.js";

export const selectActiveSessionLines = async (
  sessionNo = null,
  itemNo = null
) => {
  try {
    let sql = `
      SELECT
        sl.line_no,
        sl.session_no,
        sl.item_no,
        sl.quantity,
        sl.created_at,
        GROUP_CONCAT(pa.attr_name SEPARATOR ', ') AS attr_name_as_string,
          COALESCE(
          JSON_ARRAYAGG(
            JSON_OBJECT('attr_id', pa.attr_id, 'attr_name', pa.attr_name)
          ), '[]'
        ) AS attr_as_array,
        u.name
      FROM
        work_session_lines AS sl
      JOIN
        work_session_line_attr AS la ON sl.line_no = la.line_no
        AND sl.session_no = la.session_no
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

    // Append WHERE clause if conditions exist
    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(" AND ")}`;
    }

    // Add ORDER BY clause
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
    throw error;
  }
};
