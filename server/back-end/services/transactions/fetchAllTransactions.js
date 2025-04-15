//
// server/back-end/services/transactions/fetchAllTransactions.js

import { formatDate } from "../../utils/dates/dateHelper.js";

import { selectAllTransactions } from "../../models/transactions/selectAllTransactions.js";

export const fetchAllTransactions = async () => {
  const transactions = await selectAllTransactions();

  return transactions.map((transaction) => {
    return {
      transaction_id: transaction.transaction_id,
      order_no: transaction.order_no,
      name: transaction.name,
      type: transaction.type,
      amount: transaction.amount,
      payment_amount: transaction.payment_amount,
      created_at: formatDate(transaction.created_at),
    };
  })

};
