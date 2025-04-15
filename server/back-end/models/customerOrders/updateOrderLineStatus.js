//
// server/back-end/models/customerOrders/updateOrderLineStatus.js

export const updateOrderLineStatus = async (
  connection,
  orderNo,
  lineNo,
  field,
  value
) => {
  try {
    await connection.query(
      `
      UPDATE
        orders_list
      SET
        ${field} = ${value}
      WHERE
        order_no = ?
        AND line_no = ?
      `,
      [orderNo, lineNo]
    );
  } catch (error) {
    throw new Error("Failed to update Line Status: " + error.message);
  }
};
