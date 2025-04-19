//
// server/back-end/services/products/createProduct.js

import { selectSingleProduct } from "../../models/products/selectSingleProduct.js";
import { insertNewProduct } from "../../models/products/insertNewProduct.js";

import alterProductMapping from "../../mappings/alterProductMapping.js";

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
    const inputData = {
      itemNo,
      description,
      type,
      pricePerThousandToString: pricePerThousand,
      thickness,
      width,
      length,
      costToString: cost,
    };

    const sanitizedData = {};

    for (const [field, config] of Object.entries(alterProductMapping)) {
      const value = inputData[field];

      if (value === undefined || value === null) {
        throw new AppError(400, `Missing value for "${field}"`);
      }

      if (config.validate && !config.validate(value)) {
        throw new AppError(400, `Invalid value "${value}" for "${field}"`);
      }

      sanitizedData[field] = config.sanitize ? config.sanitize(value) : value;
    }

    // Check if product already exists
    const existingProduct = await selectSingleProduct(itemNo);
    if (existingProduct !== null) {
      throw new AppError(
        400,
        `Product ${itemNo} already exists. Search for Product instead.`
      );
    }

    // Pass OBJECT
    await insertNewProduct({
      itemNo,
      description: sanitizedData.description,
      type: sanitizedData.type,
      pricePerThousand: sanitizedData.pricePerThousandToString,
      thickness: sanitizedData.thickness,
      width: sanitizedData.width,
      length: sanitizedData.length,
      cost: sanitizedData.costToString,
      createdBy,
    });
  } catch (error) {
    throw error;
  }
};
