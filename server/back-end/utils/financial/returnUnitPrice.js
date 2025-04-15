//
// server/back-end/utils/financial/returnUnitPrice.js

import { roundToTwoDecimals } from "./roundToTwoDecimals.js";

export const returnUnitPrice = (pp_thousand, boardfeet) => {
  const unit_price =
    boardfeet > 0 ? roundToTwoDecimals((pp_thousand * boardfeet) / 1000) : 0;

  return unit_price;
};
