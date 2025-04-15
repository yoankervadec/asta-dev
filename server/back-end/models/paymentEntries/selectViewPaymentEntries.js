//
// server/back-end/models/paymentEntries/selectViewPaymentEntries.js

import { query } from "../../configs/db.config.js";

export const selectViewPaymentEntries = async (
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
        cl.name,
        cl.phone,
        pe.date,
        tp.name AS transaction_type,
        pm.name AS payment_method,
        pe.payment_amount,
        us.name AS created_by
      FROM
        payment_entries AS pe
      JOIN
        payment_methods AS pm ON pe.payment_method = pm.id
      JOIN
        transactions AS tr ON pe.transaction_id = tr.transaction_id
      JOIN
        transaction_types AS tp ON tr.type = tp.id
      JOIN
        clients AS cl ON pe.client_id = cl.client_id
      JOIN
        users AS us ON tr.created_by = us.user_id
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
    throw new Error(
      `Failed to select "View Payment Entries": ${error.message}`
    );
  }
};
