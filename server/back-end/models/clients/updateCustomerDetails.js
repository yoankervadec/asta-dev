//
// server/back-end/models/clients/updateCustomerDetails.js

import { query } from "../../configs/db.config.js";

export const updateCustomerDetails = async (client_id, field, value) => {
  try {
    await query(
      `
      UPDATE
        clients
      SET
        ${field} = ?
      WHERE
        client_id = ?
      `,
      [value, client_id]
    );
  } catch (error) {
    throw new Error("Failed to update header: " + error.message);
  }
};
