//
// server/back-end/services/production/fetchSessionHeaders.js

import { selectSessionHeaders } from "../../models/production/selectSessionHeaders.js";

import {
  isValidBooleanOrNull,
  isValidNumberOrNull,
} from "../../utils/typeCheck/typeCheck.js";
import { formatDate } from "../../utils/dates/dateHelper.js";

import { AppError } from "../../utils/errorHandling/AppError.js";

export const fetchSessionHeaders = async (sessionNo = null, posted = null) => {
  try {
    if (!isValidNumberOrNull(sessionNo)) {
      throw new AppError(400, `Invalid Session No.: ${sessionNo}.`);
    }
    if (!isValidBooleanOrNull(posted)) {
      throw new AppError(400, "Invalid Parameters.");
    }

    const headers = await selectSessionHeaders(sessionNo, posted);

    const result = headers.map((header) => {
      const commitDisabled = header.posted === 1 || header.line_count === 0;

      return {
        sessionNo: header.session_no,
        commitDisabled,
        isPosted: header.posted,
        postedAt: formatDate(header.posted_at),
        warehouse: {
          warehouseId: header.whs_id,
          warehouseName: header.whs_name,
        },
        details: {
          lines: header.line_count,
          createdAt: formatDate(header.created_at),
          createdBy: header.created_by,
          createdByName: header.created_by_name,
        },
      };
    });

    return result;
  } catch (error) {
    throw error;
  }
};
