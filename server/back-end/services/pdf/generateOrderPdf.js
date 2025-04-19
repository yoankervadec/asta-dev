//
// server/back-end/services/pdf/generateOrderPdf.js

import { fetchViewOrderCard } from "../customerOrders/fetchViewOrderCard.js";
import { generatePdfBuffer } from "./utils/generatePdfBuffer.js";

export const generateOrderPdf = async (orderNo) => {
  const orderData = await fetchViewOrderCard(orderNo);

  return await generatePdfBuffer("customer-order", {
    data: orderData,
  });
};
