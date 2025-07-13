//
// server/back-end/utils/typeCheck/typeCheck.js

export const isValidBooleanOrNull = (value) =>
  value === null ||
  value === 0 ||
  value === 1 ||
  value === false ||
  value === true;

export const isValidNumberOrNull = (value) =>
  value === null || (typeof value === "number" && !isNaN(value));

export const parseBool = (value, defaultValue = null) => {
  if (value === undefined || value === null) return defaultValue;
  return value === "true" || value === "1";
};
