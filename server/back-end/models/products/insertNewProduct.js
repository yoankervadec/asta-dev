//
// server/back-end/models/products/insertNewProduct.js

import { query } from "../../configs/db.config.js";

export const insertNewProduct = async (
  item_no,
  description,
  type,
  pp_thousand,
  thickness,
  width,
  length,
  cost,
  created_by
) => {
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
        item_no,
        description,
        type,
        pp_thousand,
        thickness,
        width,
        length,
        cost,
        created_by,
      ]
    );

    return result;
  } catch (error) {
    throw error;
  }
};
