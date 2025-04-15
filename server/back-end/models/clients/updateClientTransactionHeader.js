//
// server/back-end/models/clients/updateClientTransactionHeader.js

import { query } from "../../configs/db.config.js";

export const updateClientTransactionHeader = async (clientId, createdBy) => {
  try {
    await query(
      `
      UPDATE
        transaction_header
      SET
        transaction_type = 3,
        client_id = ?,
        required_date = CURRENT_DATE,
        payment_method = 1,
        payment_amount = 0,
        quote = FALSE,
        extra = NULL
      WHERE
        created_by = ?
      `,
      [clientId, createdBy]
    );
  } catch (error) {
    throw new Error("Failed to select client: " + error.message);
  }
};
