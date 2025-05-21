//
// server/back-end/controllers/itemEntries.controllers.js

import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseHelper.js";

import { fetchViewItemEntries } from "../services/itemEntries/fetchViewItemEntries.js";

export const handleFetchViewItemEntries = async (req, res) => {
  const isAuthenticated = req.session?.userId;
  const {
    entryNo = null,
    warehouseId = null,
    transactionId = null,
    itemNo = null,
    documentNo = null,
  } = req.params;

  try {
    const result = await fetchViewItemEntries(
      entryNo,
      warehouseId,
      transactionId,
      itemNo,
      documentNo
    );

    sendSuccessResponse(res, 200, { result }, isAuthenticated);
  } catch (err) {
    sendErrorResponse(
      res,
      err.status || 500,
      err.title || "Failed to item entries.",
      err.message,
      isAuthenticated,
      err.stack || new Error().stack
    );
  }
};
