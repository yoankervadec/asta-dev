//
// server/back-end/services/customerOrders/fetchViewOrderLines.js

import { viewOrderLines } from "../../models/customerOrders/viewOrderLines.js";

import { returnLineDiscount } from "../../utils/financial/returnLineDiscount.js";
import { returnLineAmount } from "../../utils/financial/returnLineAmount.js";
import { returnPlusTax } from "../../utils/financial/returnPlusTax.js";
import { returnLineStatus } from "../../utils/status/returnLineStatus.js";
import { returnBoardfeet } from "../../utils/financial/returnBoardfeet.js";
import { selectSingleProduct } from "../../models/products/selectSingleProduct.js";

import { AppError } from "../../utils/errorHandling/AppError.js";

import {
  isValidBooleanOrNull,
  isValidNumberOrNull,
} from "../../utils/typeCheck/typeCheck.js";
import { roundToTwoDecimals } from "../../utils/financial/roundToTwoDecimals.js";

export const fetchViewOrderLines = async (
  quote = null,
  posted = null,
  orderNo = null,
  itemNo = null,
  lineNo = null,
  active = null,
  shipped = null
) => {
  try {
    // Input validation check for quote, posted and orderNo
    if (
      !isValidBooleanOrNull(quote) ||
      !isValidBooleanOrNull(posted) ||
      !isValidBooleanOrNull(shipped) ||
      !isValidBooleanOrNull(active)
    ) {
      throw new AppError(
        400,
        "Failed to fetch order lines.",
        "Invalid Boolean values."
      );
    }
    if (!isValidNumberOrNull(orderNo)) {
      throw new AppError(
        400,
        `Failed to fetch order lines: Order number "${orderNo}" is invalid.`,
        "Contact Yoan."
      );
    }
    if (itemNo !== null) {
      const validProduct = await selectSingleProduct(itemNo);
      if (validProduct === null) {
        throw new AppError(
          400,
          `Invalid Item Number: "${itemNo}".`,
          "Invalid parameters."
        );
      }
    }

    // Fetch raw data from database
    const result = await viewOrderLines(
      quote,
      posted,
      orderNo,
      itemNo,
      lineNo,
      active,
      shipped
    );

    // Use Map to store orders keyed by orderNo
    const lines = result.map((line) => {
      // Calculate tax rate
      const pstRate = parseFloat(line.pst);
      const gstRate = parseFloat(line.gst);
      const taxRate = pstRate + gstRate;

      // Calculate line discount
      const lineDiscount = roundToTwoDecimals(
        returnLineDiscount(line.quantity, line.unit_price, line.discount)
      );

      // Calculate line subtotal
      const lineSubtotal = roundToTwoDecimals(
        returnLineAmount(line.quantity, line.unit_price, line.discount)
      );

      // Calculate line total with taxes
      const lineTotal = roundToTwoDecimals(
        returnPlusTax(lineSubtotal, taxRate)
      );

      // Calculate Boardfeet
      const lineBoardfeetAsDecimal = roundToTwoDecimals(
        returnBoardfeet(line.thickness, line.width, line.length) * line.quantity
      );

      // Determine line status
      const lineStatus = returnLineStatus(
        line.shipped,
        line.active,
        line.posted,
        line.status_name
      );

      // Construct response object
      return {
        orderNo: line.order_no,
        lineNo: line.line_no,
        lineStatus,
        customer: {
          clientId: line.client_id,
          clientName: line.name,
          phone: line.phone,
        },
        item: {
          itemNo: line.item_no,
          description: line.description,
          quantity: line.quantity,
          quantityReserved: parseFloat(line.quantity_reserved),
          quantityOnSession: parseFloat(line.quantity_on_session),
          attributeIdSetAsString: line.attr_id_set_as_string,
          attributeNameSetAsString: line.attr_name_set_as_string,
          attributes: line.attr_as_array,
        },
        pricing: {
          unitPriceAsDecimal: parseFloat(line.unit_price),
          unitPriceToString: line.unit_price.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          }),
          lineDiscountAmountAsDecimal: lineDiscount,
          lineDiscountAmountToString: lineDiscount.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          }),
          lineSubtotalAsDecimal: parseFloat(lineSubtotal),
          lineSubtotalToString: lineSubtotal.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          }),
          lineTotalAsDecimal: parseFloat(lineTotal),
          lineTotalToString: lineTotal.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          }),
          lineDiscountPercentage: line.discount,
          lineBoardfeetAsDecimal,
          lineBoardfeetToString: lineBoardfeetAsDecimal.toLocaleString(
            undefined,
            { minimumFractionDigits: 2 }
          ),
        },
        status: {
          shipped: line.shipped,
          active: line.active,
          posted: line.posted,
          statusCode: line.status,
        },
        services: {
          services: line.service_as_array || [],
        },
      };
    });

    // console.log(JSON.stringify(lines, null, 2));
    return lines;
  } catch (error) {
    throw error;
  }
};
