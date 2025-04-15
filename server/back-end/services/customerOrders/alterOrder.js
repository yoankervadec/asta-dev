//
// server/back-end/services/customerOrders/alterOrder.js

import { updateCustomerDetails } from "../../models/clients/updateCustomerDetails.js";
import { updateOrderHeader } from "../../models/customerOrders/updateOrderHeader.js";
import { fetchMapOrderHeaders } from "./fetchMapOrderHeaders.js";

import alterOrderMapping from "../../mappings/alterOrderMapping.js";

import { AppError } from "../../utils/errorHandling/AppError.js";

export const alterOrder = async (orderNo, field, value) => {
  const mapping = alterOrderMapping[field];
  const parsedOrderNo = parseFloat(orderNo);
  try {
    if (!mapping) {
      throw new AppError(
        400,
        `Field '${field}' is not recognized.`,
        "Invalid field name"
      );
    }

    // Perform validation if defined
    if (mapping.validate && !mapping.validate(value)) {
      throw new AppError(
        400,
        `Validation failed for field '${field}' with value '${value}'.`,
        "Invalid data"
      );
    }

    const { table, column } = mapping;

    if (table === "clients") {
      // Need to get cx id some way
      const header = await fetchMapOrderHeaders(null, null, parsedOrderNo);
      const clientId = header[0]?.customer?.clientId;
      if (!clientId) {
        throw new AppError(
          500,
          "Unexpected client ID.",
          "Unexpected error. Contact Yoan."
        );
      }

      await updateCustomerDetails(clientId, column, value);
    } else if (table === "orders") {
      await updateOrderHeader(parsedOrderNo, column, value);
    } else {
      throw new AppError(
        400,
        `Table '${table}' is not handled.`,
        "Unexpected table, contact Yoan"
      );
    }
  } catch (error) {
    throw error;
  }
};
