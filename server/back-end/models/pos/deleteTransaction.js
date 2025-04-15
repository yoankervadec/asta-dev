//
// server/back-end/models/pos/deleteTransaction.js

import { query } from "../../configs/db.config.js";

export const deleteTransaction = async (createdBy, taxRegion) => {
  try {
    await query(
      `
      DELETE FROM
        transaction_lines_attr
      WHERE
        created_by = ?
      `,
      [createdBy]
    );

    await query(
      `
      DELETE
      FROM
        transaction_lines
      WHERE
        created_by = ?
      `,
      [createdBy]
    );

    await query(
      `
      UPDATE
        transaction_header
      SET
        transaction_type = 3,
        client_id = NULL,
        required_date = CURRENT_DATE,
        payment_method = NULL,
        payment_amount = 0,
        quote = FALSE,
        tax_region = ?,
        extra = null,
        created_at = CURRENT_TIMESTAMP
      WHERE
        created_by = ?
      `,
      [taxRegion, createdBy]
    );
  } catch (error) {
    throw new Error("Failed to delete transaction: " + error.message);
  }
};
