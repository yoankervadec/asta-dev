//
// server/back-end/models/pos/insertToCart.js

export const insertToCart = async (
  connection,
  lineNo,
  itemNo,
  quantity,
  unitPrice,
  discPercentage,
  createdBy
) => {
  try {
    await connection.query(
      `
      INSERT INTO transaction_lines (
        line_no,
        item_no,
        quantity,
        unit_price,
        disc_perc,
        created_by)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [lineNo, itemNo, quantity, unitPrice, discPercentage, createdBy]
    );
  } catch (error) {
    throw new Error("Failed to insert product: " + error.message);
  }
};
