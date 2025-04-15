//
// server/back-end/utils/financial/returnBoardfeet.js

import { roundToTwoDecimals } from "./roundToTwoDecimals.js";

export const returnBoardfeet = (thickness, width, length) => {
  const parsedThickness = parseFloat(thickness);
  const parsedWidth = parseFloat(width);
  const parsedLength = parseFloat(length);
  const boardfeet = roundToTwoDecimals(
    (parsedWidth * parsedThickness * parsedLength) / 12
  );

  return boardfeet;
};
