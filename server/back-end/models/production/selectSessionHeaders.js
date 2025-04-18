//
// server/back-end/models/production/selectSessionHeaders.js

import { query } from "../../configs/db.config.js";

export const selectSessionHeaders = async (sessionNo = null, posted = null) => {
  try {
    let sql = `
      SELECT
        sh.session_no,
        sh.whs_id,
        wl.whs_name,
        COALESCE(COUNT(sl.line_no), 0) AS line_count,
        sh.posted,
        sh.created_at,
        sh.posted_at,
        sh.created_by,
        us.user_name AS created_by_name
      FROM
        work_session_header AS sh
      JOIN
        warehouse_locations AS wl ON sh.whs_id = wl.whs_id
      JOIN
        work_session_lines AS sl ON sh.session_no = sl.session_no
      JOIN
        users AS us ON sh.created_by = us.user_id
      `;

    // Add conditions dynamically
    const conditions = [];
    const params = [];

    if (sessionNo !== null) {
      conditions.push("sh.session_no = ?");
      params.push(sessionNo);
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
        sh.session_no
      ORDER BY
        sh.session_no DESC
      `;

    // Execute query
    const result = await query(sql, params);
    return result;
  } catch (error) {
    throw new Error("Failed to select Session Headers: " + error.message);
  }
};
