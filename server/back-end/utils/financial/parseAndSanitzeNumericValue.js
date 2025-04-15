//
// server/back-end/utils/financial/parseAndSanitzeNumericValue.js

export const parseAndSanitzeNumericValue = (value) => {
  if (typeof value === "string") {
    return parseFloat(value.replace(/,/g, ""));
  }
  return value;
};
