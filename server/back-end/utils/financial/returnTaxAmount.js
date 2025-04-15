//
// server/back-end/utils/financial/returnTaxAmount.js

export const returnTaxAmount = (subtotal, tax_percentage) => {
  const taxAmount = subtotal * (tax_percentage / 100);

  return parseFloat(taxAmount);
};
