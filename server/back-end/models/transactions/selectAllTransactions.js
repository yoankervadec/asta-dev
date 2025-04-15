//
// server/back-end/models/transactions/selectAllTransactions.js

import { query } from "../../configs/db.config.js";

export const selectAllTransactions = async () => {
  try {
    const transactions = await query(
      `
        SELECT
          t.transaction_id,
          o.order_no,
          c.name,
          tt.name AS type,
          t.amount,
          IFNULL(p.payment_amount, 0.00) AS payment_amount,
          t.created_at
        FROM
          transactions AS t
        JOIN
          orders AS o ON t.order_no = o.order_no
        JOIN
          clients AS c ON o.client_id = c.client_id
        JOIN
          transaction_types AS tt ON t.type = tt.id
        LEFT JOIN
          payment_entries AS p ON t.transaction_id = p.transaction_id
        ORDER BY
          t.transaction_id DESC
      `
    );
    return transactions;
  } catch (error) {
    throw new Error(error.message);
  }
};
