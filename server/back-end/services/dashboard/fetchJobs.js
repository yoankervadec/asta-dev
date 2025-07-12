//
// server/back-end/services/dashboard/fetchJobs.js

import { fetchMapOrderHeaders } from "../customerOrders/fetchMapOrderHeaders.js";
import { fetchViewOrderLines } from "../customerOrders/fetchViewOrderLines.js";

export const fetchJobs = async (quote = null, posted = 0, orderNo = null) => {
  try {
    const [orderHeaders, orderLines] = await Promise.all([
      fetchMapOrderHeaders(quote, posted, orderNo),
      fetchViewOrderLines(quote, posted, orderNo, null, null, 1, 0),
    ]);

    const orderLinesMap = new Map();
    orderLines.forEach((line) => {
      if (!orderLinesMap.has(line.orderNo)) {
        orderLinesMap.set(line.orderNo, []);
      }
      orderLinesMap.get(line.orderNo).push(line);
    });

    if (orderHeaders.length === 0) return null;

    const ordersWithLines = orderHeaders.map((order) => ({
      ...order,
      orderLines: orderLinesMap.get(order.meta.orderNo) || [],
    }));

    return ordersWithLines;
  } catch (error) {
    throw error;
  }
};
