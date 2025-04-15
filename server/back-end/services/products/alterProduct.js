//
// server/back-end/services/products/alterProduct.js

import { updateProduct } from "../../models/products/updateProduct.js";
import { selectSingleProduct } from "../../models/products/selectSingleProduct.js";

import alterProductMapping from "../../mappings/alterProductMapping.js";

import { AppError } from "../../utils/errorHandling/AppError.js";

export const alterProduct = async (itemNo, field, value) => {
  try {
    // Vaidate field and basic value
    const mapping = alterProductMapping[field];
    if (!mapping) {
      throw new AppError(
        400,
        `Error in updating Transaction Header.`,
        `Field "${field}" is not recognized.`
      );
    }

    // Fixes "1,700.00" to 1700
    const sanitizedValue = mapping.sanitize ? mapping.sanitize(value) : value;

    if (mapping.validate && !mapping.validate(value)) {
      throw new AppError(
        400,
        `Invalid value "${value}" for "${field}".`,
        "Invalid data"
      );
    }
    const { table, column } = mapping;

    const product = await selectSingleProduct(itemNo);
    if (itemNo === null || itemNo === undefined || product === null) {
      throw new AppError(
        400,
        `Invalid Item No. : "${itemNo}".`,
        "Failed to update."
      );
    }

    await updateProduct(itemNo, column, sanitizedValue);
    console.log(
      `Updated Product "${itemNo}" (${field}) to "${sanitizedValue}".`
    );
  } catch (error) {
    throw error;
  }
};
