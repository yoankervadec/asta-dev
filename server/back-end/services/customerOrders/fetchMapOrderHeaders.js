//
// server/back-end/services/customerOrders/fetchMapOrderHeaders.js

import { format } from "date-fns";

import { viewOrderHeader } from "../../models/customerOrders/viewOrderHeader.js";
import { fetchOrderLines } from "./fetchOrderLines.js";
import { fetchPaymentEntries } from "../paymentEntries/fetchPaymentEntries.js";

import { roundToTwoDecimals } from "../../utils/financial/roundToTwoDecimals.js";
import { returnOrderStatus } from "../../utils/status/returnOrderStatus.js";
import { formatDate } from "../../utils/dates/dateHelper.js";

import {
  isValidBooleanOrNull,
  isValidNumberOrNull,
} from "../../utils/typeCheck/typeCheck.js";

export const fetchMapOrderHeaders = async (
  quote = null,
  posted = null,
  orderNo = null,
  clientId = null
) => {
  try {
    // Input validation
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
        message: `Failed to fetch order lines: Client ID "${clientId}" is invalid.`,
        title: "Contact Yoan.",
      };
    }

    // Fetch data
    const [orderHeaders, orderLines, paymentLines] = await Promise.all([
      viewOrderHeader(quote, posted, orderNo, clientId),
      fetchOrderLines(quote, posted, orderNo),
      fetchPaymentEntries(null, orderNo, clientId),
    ]);

    if (orderHeaders.length === 0) return;

    // Organize order lines and payment entries by order number
    const orderLinesMap = new Map();
    const paymentEntriesMap = new Map();

    orderLines.forEach((line) => {
      if (!orderLinesMap.has(line.orderNo)) {
        orderLinesMap.set(line.orderNo, []);
      }
      orderLinesMap.get(line.orderNo).push(line);
    });

    paymentLines.forEach((entry) => {
      if (!paymentEntriesMap.has(entry.orderNo)) {
        paymentEntriesMap.set(entry.orderNo, []);
      }
      paymentEntriesMap.get(entry.orderNo).push(entry);
    });

    // Create a Map to store order details
    const groupedOrders = [];

    for (const orderHeader of orderHeaders) {
      const orderNo = orderHeader.order_no;

      // Retrieve associated order lines and payment entries
      const orderLines = orderLinesMap.get(orderNo) || [];
      const paymentEntries = paymentEntriesMap.get(orderNo) || [];

      // Calculate totals for active lines
      const rawTotals = orderLines
        .filter((line) => line.status?.active === 1)
        .reduce(
          (acc, line) => {
            acc.subtotalAsDecimal += line.pricing.lineSubtotal;
            acc.discountAsDecimal += line.pricing.lineDiscountAmount;
            acc.pstAsDecimal += line.pricing.linePst;
            acc.gstAsDecimal += line.pricing.lineGst;
            acc.totalAsDecimal += line.pricing.lineTotal;
            return acc;
          },
          {
            subtotalAsDecimal: 0,
            discountAsDecimal: 0,
            pstAsDecimal: 0,
            gstAsDecimal: 0,
            totalAsDecimal: 0,
          }
        );

      const paymentAmountAsDecimal = paymentEntries.reduce(
        (acc, entry) => acc + entry.details.amount,
        0
      );

      // Manually round and format totals
      const totals = {
        subtotalAsDecimal: roundToTwoDecimals(rawTotals.subtotalAsDecimal),
        subtotalToString: roundToTwoDecimals(
          rawTotals.subtotalAsDecimal
        ).toLocaleString(undefined, {
          minimumFractionDigits: 2,
        }),

        discountAsDecimal: roundToTwoDecimals(rawTotals.discountAsDecimal),
        discountToString: roundToTwoDecimals(
          rawTotals.discountAsDecimal
        ).toLocaleString(undefined, {
          minimumFractionDigits: 2,
        }),

        pstAsDecimal: roundToTwoDecimals(rawTotals.pstAsDecimal),
        pstToString: roundToTwoDecimals(rawTotals.pstAsDecimal).toLocaleString(
          undefined,
          {
            minimumFractionDigits: 2,
          }
        ),

        gstAsDecimal: roundToTwoDecimals(rawTotals.gstAsDecimal),
        gstToString: roundToTwoDecimals(rawTotals.gstAsDecimal).toLocaleString(
          undefined,
          {
            minimumFractionDigits: 2,
          }
        ),

        totalAsDecimal: roundToTwoDecimals(rawTotals.totalAsDecimal),
        totalToString: roundToTwoDecimals(
          rawTotals.totalAsDecimal
        ).toLocaleString(undefined, {
          minimumFractionDigits: 2,
        }),

        paymentAmountAsDecimal: roundToTwoDecimals(paymentAmountAsDecimal),
        paymentAmountToString: roundToTwoDecimals(
          paymentAmountAsDecimal
        ).toLocaleString(undefined, {
          minimumFractionDigits: 2,
        }),

        balanceAsDecimal: roundToTwoDecimals(
          rawTotals.totalAsDecimal - paymentAmountAsDecimal
        ),
        balanceToString: roundToTwoDecimals(
          rawTotals.totalAsDecimal - paymentAmountAsDecimal
        ).toLocaleString(undefined, {
          minimumFractionDigits: 2,
        }),
      };

      const linesToShip = orderLines.filter((line) => line.readyToShip).length;

      // Determine the order status
      const orderStatus = returnOrderStatus(
        orderHeader.quote,
        orderHeader.consolidated,
        orderLines.map((line) => ({
          active: line.status.active,
          shipped: line.status.shipped,
          status_id: line.status.statusCode,
        })),
        totals.balanceAsDecimal
      );

      // Construct final JSON object for this order
      const orderDetails = {
        meta: {
          orderNo,
          status: orderStatus,
          quote: orderHeader.quote,
          consolidated: orderHeader.consolidated,
          posted: orderHeader.posted,
          linesToShip,
        },
        customer: {
          clientId: orderHeader.client_id,
          name: orderHeader.name,
          name2: orderHeader.name2,
          contact: {
            phone: orderHeader.phone,
            phone2: orderHeader.phone2,
            email: orderHeader.email,
          },
          location: {
            address: orderHeader.address,
            city: orderHeader.city,
            postalCode: orderHeader.postal_code,
          },
          details: {
            extra: orderHeader.client_extra,
            createdAt: formatDate(orderHeader.client_created_at),
            createdBy: orderHeader.client_created_by,
          },
        },
        orderInfo: {
          orderNo,
          requiredDate: format(
            new Date(orderHeader.required_date),
            "yyyy-MM-dd"
          ),
          extra: orderHeader.order_extra,
          priority: orderHeader.priority,
          taxRegion: orderHeader.tax_region,
          createdAt: formatDate(orderHeader.order_created_at),
          createdBy: orderHeader.order_created_by,
        },
        totals,
      };

      // Add the order details to the array
      groupedOrders.push(orderDetails);
    }

    // console.log(groupedOrders);
    return groupedOrders;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
