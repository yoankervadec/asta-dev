//
// server/constant/customerOrderStatus.js

export const LINE_STATUS = Object.freeze({
  ready: 1,
  waiting: 2,
  processing: 3,
  servicePending: 5,
});

export const ORDER_STATUS = Object.freeze({
  canceledQuote: {
    id: 1,
    statusName: "Canceled quote",
  },
  quote: {
    id: 2,
    statusName: "Quote",
  },
  consolidated: {
    id: 3,
    statusName: "Consolidated",
  },
  canceled: {
    id: 4,
    statusName: "Canceled",
  },
  shippedWithBalance: {
    id: 5,
    statusName: "Shipped with balance",
  },
  partiallyShipped: {
    id: 6,
    statusName: "Partially shipped",
  },
  paymentPending: {
    id: 7,
    statusName: "Payment pending",
  },
  ready: {
    id: 8,
    statusName: "Ready",
  },
  processing: {
    id: 9,
    statusName: "Processing",
  },
  waiting: {
    id: 10,
    statusName: "Waiting",
  },
  undetermined: {
    id: 11,
    statusName: "Undermined",
  },
  shipped: {
    id: 12,
    statusName: "Shipped",
  },
  servicePending: {
    id: 13,
    statusName: "Service Pending",
  },
});
