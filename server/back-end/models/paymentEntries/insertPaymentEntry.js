//
// server/back-end/models/paymentEntries/insertPaymentEntry.js

export const insertPaymentEntry = async (
  connection,
  transactionId,
  orderNo,
  clientId,
  paymentAmount,
  paymentMethod
) => {
  try {
    await connection.query(
      `
      INSERT INTO
        payment_entries (
          transaction_id,
          order_no,
          client_id,
          payment_method,
          payment_amount
        )
      VALUES (?, ?, ?, ?, ?)
      `,
      [transactionId, orderNo, clientId, paymentMethod, paymentAmount]
    );
  } catch (error) {
    throw new Error("Failed to insert Payment Entry: " + error.message);
  }
};
