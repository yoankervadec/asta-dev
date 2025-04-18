//
// server/back-end/models/products/selectSingleProduct.js

import { query } from "../../configs/db.config.js";

export const selectSingleProduct = async (itemNo) => {
  try {
    const [product] = await query(
      `
      SELECT
        item_no,
        description,
        type,
        pp_thousand,
        thickness,
        width,
        length,
        cost,
        created_at,
        created_by
      FROM
        products
      WHERE
        item_no = ?
      `,
      [itemNo]
    );
    if (!product) {
      return null;
    }

    return product;
  } catch (error) {
    throw new Error("Failed to select Product Details: " + error.message); // Handle any errors
  }
};
