//
// server/back-end/utils/financial/returnLineDiscount.js

export const returnLineDiscount = (quantity, unit_price, disc_perc) => {
  const lineDiscount = parseFloat(
    (quantity * unit_price * (disc_perc / 100)).toFixed(2)
  );

  return lineDiscount;
};
