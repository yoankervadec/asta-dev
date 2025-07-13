//
// server/back-end/controllers/dashboard.controllers.js

import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseHelper.js";

import { parseBool } from "../utils/typeCheck/typeCheck.js";

import { fetchJobs } from "../services/dashboard/fetchJobs.js";

export const handleFetchJobs = async (req, res) => {
  const isAuthenticated = req.session.userId;

  const { woodType = null } = req.query;

  const hasCanceledLines = parseBool(req.query.hasCanceledLines);
  const hasFulfilledLines = parseBool(req.query.hasFulfilledLines);
  const showQuotes = parseBool(req.query.showQuotes);
  const showPostedOrders = parseBool(req.query.showPostedOrders);

  try {
    const jobs = await fetchJobs({
      woodType,
      hasCanceledLines,
      hasFulfilledLines,
      showQuotes,
      showPostedOrders,
    });

    sendSuccessResponse(res, 200, { jobs }, isAuthenticated);
  } catch (err) {
    sendErrorResponse(
      res,
      err.status || 500,
      err.title || "Failed to fetch Jobs",
      err.message,
      isAuthenticated,
      err.stack || new Error().stack
    );
  }
};
