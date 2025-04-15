// 
// server/back-end/controllers/transactions.controller.js

import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseHelper.js";

import { fetchAllTransactions } from "../services/transactions/fetchAllTransactions.js";

export const handleFetchAllTransactions = async (req, res) => {
  const isAuthenticated = req.session?.userId;

  try {
    const transactions = await fetchAllTransactions();
    sendSuccessResponse(res, 201, { transactions }, isAuthenticated);
  } catch (err) {
    sendErrorResponse(
      res,
      500,
      "Failed to fetch transactions",
      err.message,
      isAuthenticated
    );
  }
};