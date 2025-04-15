//
// server/back-end/models/customerOrders/insertCustomerOrderLineAttribute.js

export const insertCustomerOrderLineAttribute = async (
  connection,
  orderNo,
  lineNo,
  attributeId
) => {
  try {
    await connection.query(
      `
      INSERT INTO
        orders_list_line_attr (
          order_no,
          line_no,
          attr_id
        )
      VALUES
        (?, ?, ?)
      `,
      [orderNo, lineNo, attributeId]
    );
  } catch (error) {
    throw new Error(
      "Failed to insert Customer Order Line Attribute: " + error.message
    );
  }
};
