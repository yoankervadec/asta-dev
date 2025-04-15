//
// server/back-end/models/customerOrders/updateOrderHeader.js

import { query } from "../../configs/db.config.js";

export const updateOrderHeader = async (orderNo, field, value) => {
  try {
    await query(
      `
      UPDATE
        orders
      SET
        ${field} = ?
      WHERE
        order_no = ?
      `,
      [value, orderNo]
    );
  } catch (error) {
    throw new Error(`Failed to update Order Header: ${error.message}`);
  }
};
