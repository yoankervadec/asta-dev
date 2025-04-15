//
// server/back-end/models/pos/deleteTransactionLine.js

import { query } from "../../configs/db.config.js";

export const deleteTransactionLine = async (creaedBy, lineNo) => {
  try {
    await query(
      `
      DELETE FROM
        transaction_lines_attr
      WHERE
        created_by = ? AND
        line_no = ?
      `,
      [creaedBy, lineNo]
    );

    await query(
      `
      DELETE
      FROM
        transaction_lines
      WHERE
        created_by = ? AND
        line_no = ?
      `,
      [creaedBy, lineNo]
    );
  } catch (error) {
    throw new Error("Failed to void line: " + error.message);
  }
};
