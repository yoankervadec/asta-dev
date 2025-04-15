//
// server/back-end/controllers/dashboard.controllers.js

import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseHelper.js";

import { fetchJobs } from "../services/dashboard/fetchJobs.js";

export const handleFetchJobs = async (req, res) => {
  const isAuthenticated = req.session.userId;

  try {
    const jobs = await fetchJobs();

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
