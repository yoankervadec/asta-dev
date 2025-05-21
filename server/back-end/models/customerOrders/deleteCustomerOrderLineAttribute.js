//
// server/back-end/models/customerOrders/deleteCustomerOrderLineAttribute.js

export const deleteCustomerOrderLineAttribute = async (
  connection,
  orderNo,
  lineNo,
  attributeId
) => {
  try {
    await connection.query(
      `
      DELETE FROM
        orders_list_line_attr
      WHERE
        order_no = ? AND
        line_no = ? AND
        attr_id = ?
      `,
      [orderNo, lineNo, attributeId]
    );
  } catch (error) {
    throw new Error(
      "Failed to delete Customer Order Line Attribute: " + error.message
    );
  }
};
