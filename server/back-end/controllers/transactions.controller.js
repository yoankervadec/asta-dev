//
// server/back-end/controllers/transactions.controller.js

import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseHelper.js";

import { fetchTransactions } from "../services/transactions/fetchTransactions.js";

export const handleFetchAllTransactions = async (req, res) => {
  const isAuthenticated = req.session?.userId;
  const {
    transactionId = null,
    orderNo = null,
    clientId = null,
    transactionType = null,
  } = req.body;

  try {
    const transactions = await fetchTransactions(
      transactionId,
      orderNo,
      clientId,
      transactionType
    );
    sendSuccessResponse(res, 201, { transactions }, isAuthenticated);
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
