//
// server/back-end/models/pos/selectMaxLineNo.js

import { query } from "../../configs/db.config.js";

export const selectMaxLineNo = async (created_by) => {
  const result = await query(
    `
    SELECT
      MAX(line_no) AS max_line_no
    FROM
      transaction_lines
    WHERE
      created_by = ?
    `,
    [created_by]
  );

  return result[0]?.max_line_no ?? 0;
};
