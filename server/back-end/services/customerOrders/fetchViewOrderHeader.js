//
// server/back-end/services/customerOrders/fetchViewOrderHeader.js

import { format } from "date-fns";
import { formatDate } from "../../utils/dates/dateHelper.js";

import { viewOrderHeader } from "../../models/customerOrders/viewOrderHeader.js";
import { fetchOrderLines } from "./fetchOrderLines.js";
import { fetchPaymentEntries } from "../paymentEntries/fetchPaymentEntries.js";

import { returnOrderStatus } from "../../utils/status/returnOrderStatus.js";
import { roundToTwoDecimals } from "../../utils/financial/roundToTwoDecimals.js";
import { isValidNumberOrNull } from "../../utils/typeCheck/typeCheck.js";

import { AppError } from "../../utils/errorHandling/AppError.js";

// Return comprehensive view on  SINGLE order header, no further calculation

export const fetchViewOrderHeader = async (orderNo) => {
  try {
    // Validate orderNo
    if (
      !isValidNumberOrNull(orderNo) ||
      orderNo === null ||
      orderNo === undefined
    ) {
      throw new AppError(
        400,
        `Invalid order number: ${orderNo}`,
        "Contact Yoan."
      );
    }

    // Fetch order header information
    const orderHeaderResults = await viewOrderHeader(null, null, orderNo);
    if (orderHeaderResults.length === 0) {
      throw new AppError(
        404,
        `Order number "${orderNo}" not found.`,
        "Order Not Found"
      );
    }
    const orderHeader = orderHeaderResults[0];

    // Fetch order lines for the specified order
    const orderLines = await fetchOrderLines(null, null, orderNo);
    // Fetch payment entries for the specified order
    const paymentEntries = await fetchPaymentEntries(null, orderNo, null);

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

    // Determine shipDisable
    const shipDisable = orderHeader.quote === 1 || linesToShip === 0;
    // Determine payDisable
    const payDisable =
      orderHeader.quote === 1 || parseFloat(totals.balanceAsDecimal) === 0;
    // Determine convertDisable
    const convertDisable = orderHeader.quote === 0;
    // Determine addDisable
    const addDisable =
      orderHeader.consolidated === 1 ||
      orderLines.some((line) => line.status.shipped === 1) ||
      orderLines.some((line) => line.status.posted === 1) ||
      orderLines.every((line) => line.status.active === 0);
    // Determine modifyDisable
    const modifyDisable =
      orderHeader.has_invoice === 1 ||
      orderLines.every((line) => line.status.active === 0);

    // Disabled toggles
    const toggles = {
      shipDisable,
      payDisable,
      convertDisable,
      addDisable,
      modifyDisable,
    };

    // Construct final JSON object
    const orderDetails = {
      meta: {
        orderNo: orderHeader.order_no,
        status: orderStatus,
        quote: orderHeader.quote,
        consolidated: orderHeader.consolidated,
        hasInvoice: orderHeader.has_invoice,
        invoiceCount: orderHeader.invoice_count,
        posted: orderHeader.posted,
        linesToShip,
        toggles,
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
        orderNo: orderHeader.order_no,
        requiredDate: format(new Date(orderHeader.required_date), "yyyy-MM-dd"),
        extra: orderHeader.order_extra,
        priority: orderHeader.priority,
        taxRegion: orderHeader.tax_region,
        createdAt: formatDate(orderHeader.order_created_at),
        createdBy: orderHeader.order_created_by,
      },
      totals,
    };

    // console.log(JSON.stringify(orderDetails, null, 2));
    return orderDetails;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
