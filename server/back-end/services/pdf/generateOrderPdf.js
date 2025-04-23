//
// server/back-end/services/pdf/generateOrderPdf.js

import { fetchViewOrderCard } from "../customerOrders/fetchViewOrderCard.js";
import { generatePdfBuffer } from "./utils/generatePdfBuffer.js";

export const generateOrderPdf = async (orderNo) => {
  const {
    orderHeader: header,
    orderLines: lines,
    paymentEntries: paymentLines,
  } = await fetchViewOrderCard(orderNo);

  return await generatePdfBuffer("customer-order", {
    customer: header.customer,
    info: header.orderInfo,
    totals: header.totals,
    lines,
    paymentLines,
  });
};
