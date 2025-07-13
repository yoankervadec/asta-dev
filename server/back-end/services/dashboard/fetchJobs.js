//
// server/back-end/services/dashboard/fetchJobs.js

import { fetchMapOrderHeaders } from "../customerOrders/fetchMapOrderHeaders.js";
import { fetchViewOrderLines } from "../customerOrders/fetchViewOrderLines.js";

export const fetchJobs = async ({
  woodType,
  hasCanceledLines,
  hasFulfilledLines,
  showQuotes,
  showPostedOrders,
}) => {
  try {
    const [orderHeaders, orderLines] = await Promise.all([
      fetchMapOrderHeaders(showQuotes, showPostedOrders, null),
      fetchViewOrderLines(showQuotes, showPostedOrders, null, null, null, 1, 0),
    ]);

    const orderLinesMap = new Map();
    orderLines.forEach((line) => {
      if (!orderLinesMap.has(line.orderNo)) {
        orderLinesMap.set(line.orderNo, []);
      }
      orderLinesMap.get(line.orderNo).push(line);
    });

    if (orderHeaders.length === 0) return null;

    const ordersWithLines = orderHeaders.reduce((acc, order) => {
      const lines = orderLinesMap.get(order.meta.orderNo);
      if (lines && lines.length > 0) {
        acc.push({
          ...order,
          orderLines: lines,
        });
      }
      return acc;
    }, []);

    return ordersWithLines;
  } catch (error) {
    throw error;
  }
};
