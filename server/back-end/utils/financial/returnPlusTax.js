//
// server/back-end/utils/financial/returnPlusTax.js

export const returnPlusTax = (amount, taxPercentage) => {
  const taxRate = parseFloat(taxPercentage || "0") / 100;
  return parseFloat((amount * (1 + taxRate)).toFixed(2));
};
