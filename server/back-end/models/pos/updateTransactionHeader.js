//
// server/back-end/models/pos/updateTransactionHeader.js

import { query } from "../../configs/db.config.js";

export const updateTransactionHeader = async (created_by, field, value) => {
  try {
    await query(
      `
      UPDATE
        transaction_header
      SET
        ${field} = ?
      WHERE
        created_by = ?
      `,
      [value, created_by]
    );
  } catch (error) {
    throw new Error("Failed to update header: " + error.message);
  }
};
