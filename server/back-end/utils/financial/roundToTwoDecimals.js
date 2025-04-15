//
// server/back-end/utils/financial/roundToTwoDecimals.js

export const roundToTwoDecimals = (value) => {
  const rounded = Math.round((parseFloat(value) + Number.EPSILON) * 100) / 100;
  return Object.is(rounded, -0) ? 0 : rounded;
};
