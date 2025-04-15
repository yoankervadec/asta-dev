//
// server/back-end/utils/financial/returnLineAmount.js

export const returnLineAmount = (quantity, unit_price, disc_perc) => {
  const lineAmount = parseFloat(
    (quantity * unit_price * ((100 - disc_perc) / 100)).toFixed(2)
  );
  return lineAmount;
};
