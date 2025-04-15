//
// server/back-end/models/customerOrders/insertCustomerOrderLine.js

export const insertCustomerOrderLine = async (
  connection,
  orderNo,
  lineNo,
  warehouseId,
  itemNo,
  quantity,
  discountPercentage,
  unitPrice
) => {
  try {
    await connection.query(
      `
      INSERT INTO
        orders_list (
          order_no,
          line_no,
          whs_id,
          item_no,
          quantity,
          discount,
          unit_price
        )
      VALUES
        (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        orderNo,
        lineNo,
        warehouseId,
        itemNo,
        quantity,
        discountPercentage,
        unitPrice,
      ]
    );
  } catch (error) {
    throw new Error("Failed to insert Customer Order Line: " + error.message);
  }
};
