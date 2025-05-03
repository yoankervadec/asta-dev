//
// server/back-end/models/transactions/selectTransactions.js

import { query } from "../../configs/db.config.js";

export const selectTransactions = async (
  transactionId = null,
  orderNo = null,
  clientId = null,
  transactionType = null
) => {
  try {
    let sql = `
      SELECT
        tr.transaction_id,
        tr.order_no,
        tr.type,
        tt.name AS type_as_name,
        tr.amount,
        tr.created_at,
        tr.created_by,
        u.user_name AS created_by_name,
        COALESCE(SUM(pe.payment_amount), 0) AS payment_amount
      FROM
        transactions AS tr
      LEFT JOIN
        payment_entries AS pe ON tr.transaction_id = pe.transaction_id
      JOIN
        orders AS o ON tr.order_no = o.order_no
      JOIN
        transaction_types AS tt ON tr.type = tt.id
      JOIN
        users AS u ON tr.created_by = u.user_id
    `;

    const conditions = [];
    const params = [];

    if (transactionId !== null) {
      conditions.push("tr.transaction_id = ?");
      params.push(transactionId);
    }
    if (orderNo !== null) {
      conditions.push("tr.order_no = ?");
      params.push(orderNo);
    }
    if (clientId !== null) {
      conditions.push("o.client_id = ?");
      params.push(clientId);
    }
    if (transactionType !== null) {
      conditions.push("tr.type = ?");
      params.push(transactionType);
    }

    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(" AND ")}`;
    }

    sql += `
      GROUP BY
        tr.transaction_id
      ORDER BY
        tr.transaction_id DESC
    `;

    const result = await query(sql, params);
    return result;
  } catch (error) {
    throw new Error("Failed to select Transactions: " + error.message);
  }
};
