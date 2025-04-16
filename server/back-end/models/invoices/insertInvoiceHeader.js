//
// server/back-end/models/invoices/insertInvoiceHeader.js

export const insertInvoiceHeader = async (connection, orderNo, createdBy) => {
  try {
    const [result] = await connection.query(
      `
      INSERT INTO
        invoice_headers (
          order_no,
          created_by
        )
      VALUES
        (?, ?)
      `,
      [orderNo, createdBy]
    );

    return result.insertId; // invoice_no
  } catch (error) {
    throw new Error("Failed to insert Invoice Header: " + error.message);
  }
};
