//
// server/back-end/models/paymentEntries/selectPaymentEntries.js

import { query } from "../../configs/db.config.js";

export const selectPaymentEntries = async (
  transactionId = null,
  orderNo = null,
  clientId = null
) => {
  try {
    let sql = `
      SELECT
        pe.entry_no,
        pe.transaction_id,
        pe.order_no,
        pe.client_id,
        pe.date,
        pe.payment_method,
        pe.payment_amount
      FROM
        payment_entries AS pe
    `;

    const conditions = [];
    const params = [];

    if (transactionId !== null) {
      conditions.push("pe.transaction_id = ?");
      params.push(transactionId);
    }
    if (orderNo !== null) {
      conditions.push("pe.order_no = ?");
      params.push(orderNo);
    }
    if (clientId !== null) {
      conditions.push("pe.client_id = ?");
      params.push(clientId);
    }

    // Append WHERE clause if conditions exist
    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(" AND ")}`;
    }

    // Add ORDER BY clause
    sql += `
      ORDER BY
        pe.entry_no DESC;
    `;

    // Execute query
    const result = await query(sql, params);
    return result;
  } catch (error) {
    throw new Error(`Failed to select "Payment Entries: ${error.message}.`);
  }
};
