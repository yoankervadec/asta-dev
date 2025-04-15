//
// server/back-end/controllers/production.controllers.js

import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseHelper.js";

import { fetchWorkTable } from "../services/production/fetchWorkTable.js";
import { addWorkSessionLine } from "../services/production/addWorkSessionLine.js";
import { fetchWorkSession } from "../services/production/fetchWorkSession.js";
import { postWorkSession } from "../services/production/postWorkSession.js";

export const handleFetchWorkTable = async (req, res) => {
  const isAuthenticated = req.session.userId;

  try {
    const rows = await fetchWorkTable();
    const { itemNo } = req.params || null;
    const { header, lines } = await fetchWorkSession(itemNo);

    sendSuccessResponse(
      res,
      200,
      {
        workTable: rows,
        sessionHeader: header,
        sessionLines: lines,
      },
      isAuthenticated
    );
  } catch (err) {
    sendErrorResponse(
      res,
      err.status || 500,
      err.message,
      err.title || "An unnexpected error occured.",
      isAuthenticated,
      err.stack || new Error().stack
    );
  }
};

export const handleAddWorkSessionLine = async (req, res) => {
  const isAuthenticated = req.session.userId;
  const createdBy = req.session.userId;
  const { quantity, itemNo, attributes = [] } = req.body;

  try {
    await addWorkSessionLine(itemNo, quantity, attributes, createdBy);
    sendSuccessResponse(res, 201, {}, isAuthenticated);
  } catch (err) {
    sendErrorResponse(
      res,
      err.status || 500,
      err.message,
      err.title || "An unnexpected error occured.",
      isAuthenticated,
      err.stack || new Error().stack
    );
  }
};

export const handlePostWorkSession = async (req, res) => {
  const isAuthenticated = req.session.userId;
  const userId = req.session.userId;

  try {
    await postWorkSession(userId);
    sendSuccessResponse(res, 201, {}, isAuthenticated);
  } catch (err) {
    sendErrorResponse(
      res,
      err.status || 500,
      err.message,
      err.title || "An unnexpected error occured.",
      isAuthenticated,
      err.stack || new Error().stack
    );
  }
};
