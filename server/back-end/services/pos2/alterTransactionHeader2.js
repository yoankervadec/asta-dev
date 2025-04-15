//
// server/back-end/services/pos2/alterTransactionHeader2.js

import { fetchPosPage2 } from "./fetchPosPage2.js";
import { updateCustomerDetails } from "../../models/clients/updateCustomerDetails.js";
import { updateTransactionHeader } from "../../models/pos/updateTransactionHeader.js";

import updateTransactionMapping from "../../mappings/updateTransactionMapping.js";

import { AppError } from "../../utils/errorHandling/AppError.js";

export const alterTransactionHeader2 = async (field, value, createdBy) => {
  const mapping = updateTransactionMapping[field];

  try {
    if (!mapping) {
      throw new AppError(
        400,
        `Error in updating Transaction Header.`,
        `Field "${field}" is not recognized.`
      );
    }

    if (mapping.validate && !mapping.validate(value)) {
      throw new AppError(
        400,
        `Invalid value "${value}" for "${field}".`,
        "Invalid data"
      );
    }

    const { table, column } = mapping;

    const { transactionHeader } = await fetchPosPage2(createdBy);
    const { client, totals, payment, details } = transactionHeader;

    if (!client || !totals) {
      throw new AppError(
        500,
        "Internal Error: Failed to fetch critical information.",
        "Contact Yoan."
      );
    }

    // Client Table
    if (table === "clients") {
      const clientId = client.clientId;
      await updateCustomerDetails(clientId, column, value);

      // Transaction Header Table
    } else if (table === "transaction_header") {
      // Prevents error when value === "" or " " or something else
      if (field === "paymentAmount" && !Number.isFinite(parseFloat(value))) {
        value = 0;
      }
      // Prevent payment on Quote
      if (
        (field === "paymentAmount" &&
          details.isQuote &&
          parseFloat(value) > 0) ||
        (field === "quote" && value && payment.paymentAmountAsDecimal > 0)
      ) {
        throw new AppError(
          400,
          "Failed to update: Quotes cannot hold payments.",
          `Remove "Quote" flag or remove payment amount. `
        );
      }
      // Check if paymentAmount exceeds balance
      if (
        field === "paymentAmount" &&
        parseFloat(value) > totals.totalAmountAsDecimal
      ) {
        throw new AppError(
          400,
          `Failed to update: Payment amount "${parseFloat(value).toLocaleString(
            undefined,
            { minimumFractionDigits: 2 }
          )}" exceeds transaction total "${totals.totalAmountToString}".`,
          "Invalid value."
        );
      }
      await updateTransactionHeader(createdBy, column, value);
    } else {
      throw new AppError(
        400,
        "Table update not handled at this time.",
        "Contact Yoan."
      );
    }
  } catch (error) {
    throw error;
  }
};
