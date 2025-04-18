//
// server/back-end/services/production/fetchSessionLines.js

import { selectSessionLines } from "../../models/production/selectSessionLines.js";
import { selectSingleProduct } from "../../models/products/selectSingleProduct.js";

import {
  isValidBooleanOrNull,
  isValidNumberOrNull,
} from "../../utils/typeCheck/typeCheck.js";
import { formatDate } from "../../utils/dates/dateHelper.js";

import { AppError } from "../../utils/errorHandling/AppError.js";

export const fetchSessionLines = async (
  sessionNo = null,
  itemNo = null,
  posted = null
) => {
  try {
    if (!isValidNumberOrNull(sessionNo)) {
      throw new AppError(400, `Invalid Session No.: ${sessionNo}.`);
    }
    if (!isValidBooleanOrNull(posted)) {
      throw new AppError(400, "Invalid Parameters.");
    }
    if (itemNo !== null) {
      const validProduct = await selectSingleProduct(itemNo);
      if (validProduct.length === 0 || validProduct === null) {
        throw {
          status: 400,
          message: `Invalid Item Number: "${itemNo}".`,
          title: "Invalid parameters.",
        };
      }
    }

    const rawLines = await selectSessionLines(sessionNo, itemNo, posted);

    const lines = rawLines.map((line) => {
      return {
        sessionNo: line.session_no,
        lineNo: line.line_no,
        isPosted: line.posted,
        item: {
          itemNo: line.item_no,
          quantity: line.quantity,
          attributes: {
            attributeNameAsString: line.attr_name_as_string,
            attributes: line.attr_as_array
              ? JSON.parse(line.attr_as_array)
              : [],
          },
        },
        details: {
          createdAt: formatDate(line.created_at),
          createdBy: line.created_by,
          createdByName: line.created_by_name,
        },
      };
    });

    return lines;
  } catch (error) {
    throw error;
  }
};
