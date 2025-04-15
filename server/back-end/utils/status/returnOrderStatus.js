//
// server/back-end/utils/status/returnOrderStatus.js

export const returnOrderStatus = (quote, consolidated, itemLines, balance) => {
  const activeLines = itemLines.filter((item) => item.active);
  const inactiveLines = itemLines.filter((item) => !item.active);

  const statusIds = activeLines.map((item) => item.status_id);

  const allInactive = itemLines.length > 0 && activeLines.length === 0;
  const allShipped =
    activeLines.length > 0 && activeLines.every((item) => item.shipped);
  const someShipped = activeLines.some((item) => item.shipped);
  const allReady = statusIds.length > 0 && statusIds.every((id) => id === 1);
  const someProcessing = statusIds.some((id) => id === 3);
  const someWaiting = statusIds.some((id) => id === 2);

  if (quote && allInactive) return "Canceled Quote";
  if (quote) return "Quote";
  if (consolidated) return "Consolidated";
  if (allInactive) return "Canceled";
  if (allShipped && balance > 0) return "Shipped with balance";
  if (allShipped) return "Shipped";
  if (someShipped && balance > 0) return "Partially Shipped with balance";
  if (someShipped) return "Partially Shipped";
  if (allReady && balance > 0) return "Payment Pending";
  if (allReady && balance === 0) return "Ready";
  if (someProcessing) return "Processing";
  if (someWaiting) return "Waiting";
  return "Not sure lol";
};
