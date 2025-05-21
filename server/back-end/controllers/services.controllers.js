//
// server/back-end/controllers/services.controllers.js

import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseHelper.js";

import { processAndCompleteService } from "../services/customerOrderServices/processAndCompleteService.js";
import { addServiceLine } from "../services/customerOrderServices/addServiceLine.js";

export const handleProcessAndCompleteService = async (req, res) => {
  const isAuthenticated = req.session?.userId;

  const { orderNo, lineNo, serviceId } = req.body;

  try {
    await processAndCompleteService(
      parseFloat(orderNo),
      parseFloat(lineNo),
      parseFloat(serviceId)
    );
    sendSuccessResponse(res, 200, {}, isAuthenticated);
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

export const handleAddServiceLine = async (req, res) => {
  const isAuthenticated = req.session?.userId;

  const { orderNo, lineNo, serviceId } = req.body;

  try {
    await addServiceLine(
      parseFloat(orderNo),
      parseFloat(lineNo),
      parseFloat(serviceId)
    );

    sendSuccessResponse(res, 200, {}, isAuthenticated);
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
