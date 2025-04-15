//
// server/back-end/models/pos/insertToCartAttributes.js

export const insertToCartAttributes = async (
  connection,
  lineNo,
  attrId,
  createdBy
) => {
  try {
    await connection.query(
      `
      INSERT INTO
        transaction_lines_attr (
          line_no,
          attr_id,
          created_by
        )
      VALUES
        (?, ?, ?)
      `,
      [lineNo, attrId, createdBy]
    );
  } catch (error) {
    throw new Error("Failed to insert Attributes: " + error.message);
  }
};
