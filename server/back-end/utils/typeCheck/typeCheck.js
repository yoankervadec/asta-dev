//
// server/back-end/utils/typeCheck/typeCheck.js

export const isValidBooleanOrNull = (value) =>
  value === null || value === 0 || value === 1;

export const isValidNumberOrNull = (value) =>
  value === null || (typeof value === "number" && !isNaN(value));
