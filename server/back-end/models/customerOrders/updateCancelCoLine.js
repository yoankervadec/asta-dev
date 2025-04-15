//
// server/back-end/models/customerOrders/updateCancelCoLine.js

export const updateCancelCoLine = async (connection, orderNo, lineNo) => {
  try {
    await connection.query(
      `
      UPDATE
        orders_list
      SET
        active = 0
      WHERE
        order_no = ?
        AND line_no = ?
        AND shipped = 0 -- safeguard against shipped lines
      `,
      [orderNo, lineNo]
    );
  } catch (error) {
    throw new Error("Failed to update Customer Order Line: " + error.message);
  }
};
