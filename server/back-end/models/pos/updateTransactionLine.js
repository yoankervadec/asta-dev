//
// server/back-end/models/pos/updateTransactionLine.js

import { query } from "../../configs/db.config.js";

export const updateTransactionLine = async (
  lineNo,
  field,
  value,
  createdBy
) => {
  try {
    await query(
      `
      UPDATE
        transaction_lines
      SET
        ${field} = ?
      WHERE
        line_no = ?
        AND created_by = ?
    `,
      [value, lineNo, createdBy]
    );
  } catch (error) {
    throw new Error("Failed to update table: " + error.message);
  }
};
