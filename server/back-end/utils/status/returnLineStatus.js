//
// server/back-end/utils/status/returnLineStatus.js

export const returnLineStatus = (shipped, active, posted, status_name) => {
  if (!active) return "Canceled";
  if (shipped) return "Shipped";
  if (posted) return "Posted";
  return status_name;
};
