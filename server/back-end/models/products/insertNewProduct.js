//
// server/back-end/models/products/insertNewProduct.js

import { query } from "../../configs/db.config.js";

export const insertNewProduct = async ({
  itemNo,
  description,
  type,
  pricePerThousand,
  thickness,
  width,
  length,
  cost,
  createdBy,
}) => {
  try {
    const result = await query(
      `
      INSERT INTO products (
        item_no,
        description,
        type,
        pp_thousand,
        thickness,
        width,
        length,
        cost,
        created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        itemNo,
        description,
        type,
        pricePerThousand,
        thickness,
        width,
        length,
        cost,
        createdBy,
      ]
    );

    return result;
  } catch (error) {
    throw new Error("Failed to insert Product: " + error.message);
  }
};
