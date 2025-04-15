//
// server/back-end/models/transactions/insertTransaction.js

export const insertTransaction = async (
  connection,
  orderNo,
  transactionType,
  createdBy,
  transactionAmount = 0
) => {
  try {
    const [result] = await connection.query(
      `
      INSERT INTO
        transactions (
          order_no,
          type,
          amount,
          created_by
        )
      VALUES
        (?, ?, ?, ?)
      `,
      [orderNo, transactionType, transactionAmount, createdBy]
    );

    return result.insertId;
  } catch (error) {
    throw new Error("Failed to insert transaction entry: " + error.message);
  }
};
