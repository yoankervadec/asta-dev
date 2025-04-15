//
// server/back-end/services/customerOrders/fetchOrderLines.js

import { selectOrderLines } from "../../models/customerOrders/selectOrderLines.js";

import { returnLineDiscount } from "../../utils/financial/returnLineDiscount.js";
import { returnLineAmount } from "../../utils/financial/returnLineAmount.js";
import { returnTaxAmount } from "../../utils/financial/returnTaxAmount.js";
import { roundToTwoDecimals } from "../../utils/financial/roundToTwoDecimals.js";

import {
  isValidBooleanOrNull,
  isValidNumberOrNull,
} from "../../utils/typeCheck/typeCheck.js";

// Fetch general information on orders lines for further calculation

export const fetchOrderLines = async (
  quote = null,
  posted = null,
  orderNo = null,
  clientId = null
) => {
  try {
    // Input validation check for quote, posted and orderNo
    if (!isValidBooleanOrNull(quote) || !isValidBooleanOrNull(posted)) {
      throw {
        status: 400,
        message: "Failed to fetch order lines.",
        title: "Contact Yoan.",
      };
    }
    if (!isValidNumberOrNull(orderNo) || !isValidNumberOrNull(clientId)) {
      throw {
        status: 400,
        message: `Failed to fetch order lines: Order number "${orderNo}" is invalid.`,
        title: "Contact Yoan.",
      };
    }

    // Fetch raw data from database
    const result = await selectOrderLines(quote, posted, orderNo, clientId);

    // Transform raw data into the desired format
    const lines = result.map((line) => {
      // Calculate tax rate
      const pstRate = parseFloat(line.pst);
      const gstRate = parseFloat(line.gst);

      // Calculate and round line discount
      const lineDiscount = roundToTwoDecimals(
        returnLineDiscount(line.quantity, line.unit_price, line.discount)
      );

      // Calculate and round line subtotal
      const lineSubtotal = roundToTwoDecimals(
        returnLineAmount(line.quantity, line.unit_price, line.discount)
      );

      // Calc line PST
      const linePst = roundToTwoDecimals(
        returnTaxAmount(lineSubtotal, pstRate)
      );
      // Calc line GST
      const lineGst = roundToTwoDecimals(
        returnTaxAmount(lineSubtotal, gstRate)
      );
      // Sum sub, pst and gst for total
      const lineTotal = lineSubtotal + linePst + lineGst;

      return {
        orderNo: line.order_no,
        lineNo: line.line_no,
        readyToShip:
          line.active === 1 &&
          line.status === 1 &&
          line.posted === 0 &&
          line.shipped === 0,
        createdBy: line.created_by,
        customer: {
          clientId: line.client_id,
        },
        item: {
          itemNo: line.item_no,
          quantity: line.quantity,
        },
        pricing: {
          unitPrice: parseFloat(line.unit_price),
          lineDiscountPercentage: parseFloat(line.discount),
          lineDiscountAmount: lineDiscount,
          lineSubtotal,
          linePst,
          lineGst,
          lineTotal,
        },
        status: {
          shipped: line.shipped,
          active: line.active,
          posted: line.posted,
          statusCode: line.status,
        },
      };
    });

    // console.log(JSON.stringify(lines, null, 2));
    return lines;
  } catch (error) {
    throw error;
  }
};
