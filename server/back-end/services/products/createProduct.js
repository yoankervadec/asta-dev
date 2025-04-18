//
// server/back-end/services/products/createProduct.js

import { selectSingleProduct } from "../../models/products/selectSingleProduct.js";
import { insertNewProduct } from "../../models/products/insertNewProduct.js";

import { AppError } from "../../utils/errorHandling/AppError.js";

export const createProduct = async (
  itemNo,
  description,
  type,
  pricePerThousand,
  thickness,
  width,
  length,
  cost,
  createdBy
) => {
  try {
    if (
      itemNo === null ||
      description === null ||
      type === null ||
      pricePerThousand === null ||
      thickness === null ||
      width === null ||
      length === null
    ) {
      throw new AppError(400, "Missing required field(s)");
    }

    const product = await selectSingleProduct(itemNo);
    if (product !== null) {
      throw new AppError(
        400,
        `Product ${itemNo} already exists. Search for Product instead.`
      );
    }

    // Create the new product in the database
    await insertNewProduct(
      itemNo,
      description,
      type,
      pricePerThousand,
      thickness,
      width,
      length,
      cost,
      createdBy
    );
  } catch (error) {
    throw error;
  }
};
