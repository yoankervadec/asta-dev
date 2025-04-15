//
// server/back-end/services/pos/alterCartProduct.js

import { updateTransactionLine } from "../../models/pos/updateTransactionLine.js";
import { AppError } from "../../utils/errorHandling/AppError.js";

export const alterCartProduct = async (lineNo, field, value, createdBy) => {
  try {
    let updatedValue;

    // Map "discount" to the database column "disc_perc"
    if (field === "discount") {
      field = "disc_perc";
    }

    // Validate and sanitize inputs based on the field
    if (field === "quantity") {
      updatedValue = parseInt(value);
      if (!updatedValue || updatedValue <= 0 || updatedValue > 9999) {
        return; // Do nothing if invalid
      }
    } else if (field === "disc_perc") {
      updatedValue = parseFloat(value);
      if (isNaN(updatedValue) || updatedValue < 0 || updatedValue >= 100) {
        return; // Do nothing if invalid
      }
    } else {
      throw new AppError(
        400,
        `Field '${field}' is not supported for updates.`,
        "Invalid field"
      );
    }

    // Update the cart product in the database
    await updateTransactionLine(lineNo, field, updatedValue, createdBy);
  } catch (error) {
    throw error;
  }
};
