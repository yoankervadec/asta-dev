//
// server/back-end/services/products/createProduct.js

import { selectSingleProduct } from "../../models/products/selectSingleProduct.js";
import { insertNewProduct } from "../../models/products/insertNewProduct.js";

export const createProduct = async (productData) => {
  const {
    item_no,
    description,
    type,
    pp_thousand,
    thickness,
    width,
    length,
    cost,
    created_by,
  } = productData;

  // Check if the product already exists
  const existingProduct = await selectSingleProduct(item_no);
  if (existingProduct) {
    throw new Error(`Product "${item_no}" already exists`);
  }

  // Create the new product in the database
  await insertNewProduct(
    item_no,
    description,
    type,
    pp_thousand,
    thickness,
    width,
    length,
    cost,
    created_by
  );
};
