//
// server/back-end/models/products/updateProduct.js

import { query } from "../../configs/db.config.js";

export const updateProduct = async (itemNo, field, value) => {
  try {
    await query(
      `
      UPDATE
        products
      SET
        ${field} = ?
      WHERE
        item_no = ?
      `,
      [value, itemNo]
    );
  } catch (error) {
    throw new Error("Failed to update Product: " + error.message);
  }
};
