//
// server/back-end/services/customerOrders/fetchViewOrderCard.js

import { fetchViewOrderHeader } from "./fetchViewOrderHeader.js";
import { fetchViewOrderLines } from "./fetchViewOrderLines.js";
import { fetchViewPaymentEntries } from "../paymentEntries/fetchViewPaymentEntries.js";
import { fetchMapInvoiceHeaders } from "../invoices/fetchMapInvoiceHeaders.js";

import { isValidNumberOrNull } from "../../utils/typeCheck/typeCheck.js";

export const fetchViewOrderCard = async (orderNo) => {
  try {
    if (!isValidNumberOrNull(orderNo)) {
      throw {
        status: 400,
        message: `Failed to fetch order lines: Invalid parameter.`,
        title: "Contact Yoan.",
      };
    }

    const header = await fetchViewOrderHeader(orderNo);
    const lines = await fetchViewOrderLines(null, null, orderNo);
    const paymentEntries = await fetchViewPaymentEntries(null, orderNo, null);
    const invoices = await fetchMapInvoiceHeaders(null, orderNo, null);

    const result = {
      orderHeader: header,
      orderLines: lines,
      paymentEntries,
      invoices,
    };

    // console.log(JSON.stringify(result, null, 2));

    return result;
  } catch (error) {
    throw error;
  }
};
