//
// server/back-end/models/invoices/insertInvoiceLines.js

export const insertInvoiceLines = async (
  connection,
  invoiceNo,
  orderNo,
  lineNo
) => {
  try {
    await connection.query(
      `
      INSERT INTO
        invoice_lines (
          invoice_no,
          order_no,
          line_no
        )
      VALUES
        (?, ?, ?)
      `,
      [invoiceNo, orderNo, lineNo]
    );
  } catch (error) {
    throw new Error("Failed to insert Invoice Lines: " + error.message);
  }
};
