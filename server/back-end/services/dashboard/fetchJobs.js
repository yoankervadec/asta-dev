//
// server/back-end/services/dashboard/fetchJobs.js

import { fetchMapOrderHeaders } from "../customerOrders/fetchMapOrderHeaders.js";
import { fetchViewOrderLines } from "../customerOrders/fetchViewOrderLines.js";

export const fetchJobs = async ({
  woodType,
  showCanceledLines,
  hasFulfilledLines,
  showQuotes,
  showPostedOrders,
}) => {
  try {
    const [orderHeaders, orderLines] = await Promise.all([
      fetchMapOrderHeaders(showQuotes, showPostedOrders, null),
      fetchViewOrderLines(
        showQuotes,
        showPostedOrders,
        null,
        null,
        null,
        showCanceledLines,
        0
      ),
    ]);

    const orderLinesMap = new Map();
    orderLines.forEach((line) => {
      if (!orderLinesMap.has(line.orderNo)) {
        orderLinesMap.set(line.orderNo, []);
      }
      orderLinesMap.get(line.orderNo).push(line);
    });

    if (orderHeaders.length === 0) return null;

    let ordersWithLines = orderHeaders.reduce((acc, order) => {
      const lines = orderLinesMap.get(order.meta.orderNo);
      if (lines && lines.length > 0) {
        acc.push({
          ...order,
          orderLines: lines,
        });
      }
      return acc;
    }, []);

    // Apply line-level filtering
    if (woodType || hasFulfilledLines !== null) {
      ordersWithLines = ordersWithLines
        .map((order) => {
          const filteredLines = order.orderLines.filter((line) => {
            let match = true;

            // Filter by woodType (also check active)
            if (woodType) {
              match =
                match && line.status.active && line.item.woodType === woodType;
            }

            // Filter by hasFulfilledLines (fully reserved & not statusCode 1)
            if (hasFulfilledLines === true) {
              match = match && line.status.statusCode === 1;
            } else if (hasFulfilledLines === false) {
              match = match && line.status.statusCode !== 1;
            }

            return match;
          });

          return {
            ...order,
            orderLines: filteredLines,
          };
        })
        // Remove orders that now have no lines left
        .filter((order) => order.orderLines.length > 0);
    }

    return ordersWithLines;
  } catch (error) {
    throw error;
  }
};
