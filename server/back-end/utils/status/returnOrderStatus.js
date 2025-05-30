//
// server/back-end/utils/status/returnOrderStatus.js

import {
  ORDER_STATUS,
  LINE_STATUS,
} from "../../../constant/customerOrderStatus.js";

/**
 * Determine the status of a customer order.
 *
 * @param {number} quote
 * @param {number} consolidated
 * @param {Array<{
 *   active: number,
 *   shipped: number,
 *   status_id: number
 * }>} itemLines
 * @param {number} balance
 * @returns {string}
 */

export const returnOrderStatus = (quote, consolidated, itemLines, balance) => {
  // Extract active lines and statuses
  const activeLines = itemLines.filter((item) => item.active);
  const statusIds = activeLines.map((line) => line.status_id);

  const hasAllCanceled = itemLines.length > 0 && activeLines.length === 0;

  const hasAllShipped =
    activeLines.length > 0 && activeLines.every((line) => line.shipped);

  const hasSomeShipped = activeLines.some((line) => line.shipped);

  const hasAllReady =
    statusIds.length > 0 && statusIds.every((id) => id === LINE_STATUS.ready);

  const hasSomeServicePending =
    statusIds.length > 0 && statusIds.includes(LINE_STATUS.servicePending);

  const hasSomeProcessing = statusIds.includes(LINE_STATUS.processing);

  const hasSomeWaiting = statusIds.includes(LINE_STATUS.waiting);

  // Return status name
  if (hasAllCanceled) return ORDER_STATUS.canceled.statusName;

  if (quote) return ORDER_STATUS.quote.statusName;

  if (hasAllShipped && balance > 0)
    return ORDER_STATUS.shippedWithBalance.statusName;

  if (hasAllShipped) return ORDER_STATUS.shipped.statusName;

  if (hasSomeShipped) return ORDER_STATUS.partiallyShipped.statusName;

  if (consolidated) return ORDER_STATUS.consolidated.statusName;

  if (hasSomeProcessing) return ORDER_STATUS.processing.statusName;

  if (hasSomeWaiting) return ORDER_STATUS.waiting.statusName;

  if (hasSomeServicePending && !hasSomeProcessing && !hasSomeWaiting)
    return ORDER_STATUS.servicePending.statusName;

  if (hasAllReady && balance > 0) return ORDER_STATUS.paymentPending.statusName;

  if (hasAllReady && balance === 0) return ORDER_STATUS.ready.statusName;

  return ORDER_STATUS.undetermined.statusName;
};
