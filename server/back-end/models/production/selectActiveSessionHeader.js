//
// server/back-end/models/production/selectActiveSessionHeader.js

import { query } from "../../configs/db.config.js";

export const selectActiveSessionHeader = async () => {
  try {
    const [result] = await query(
      `
      SELECT
        sh.session_no,
        sh.posted,
        sh.created_at,
        sh.posted_at,
        u.name
      FROM
        work_session_header AS sh
      JOIN
        users AS u ON sh.created_by = u.user_id
      WHERE
        posted = 0
      ORDER BY
        session_no DESC
      LIMIT 1
      `
    );
    return result;
  } catch (error) {
    throw new Error(
      "Failed to select last active session header: " + error.message
    );
  }
};
