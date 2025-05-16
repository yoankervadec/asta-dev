//
// server/back-end/controllers/pos.controllers.js

import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseHelper.js";

import { addToCart } from "../services/pos/addToCart.js";
import { fetchPosPage2 } from "../services/pos2/fetchPosPage2.js";
import { alterCartProduct } from "../services/pos/alterCartProduct.js";
import { alterTransactionHeader2 } from "../services/pos2/alterTransactionHeader2.js";
import { voidTransaction } from "../services/pos/voidTransaction.js";
import { voidTransactionLine } from "../services/pos/voidTransactionLine.js";
import { fetchProducts } from "../services/products/fetchProducts.js";
import { createCustomerOrder } from "../services/pos2/createCustomerOrder.js";

// Add to cart
export const handleAddToCart = async (req, res) => {
  const isAuthenticated = req.session?.userId;
  const { itemNo, attribute, quantity } = req.body;
  const createdBy = req.session.userId;

  try {
    await addToCart(itemNo, attribute, quantity, createdBy);
    sendSuccessResponse(res, 200, {}, isAuthenticated);
  } catch (err) {
    sendErrorResponse(
      res,
      500,
      err.message,
      err.title || "Failed to add items to cart",
      isAuthenticated,
      err.stack || new Error().stack
    );
  }
};

// Get full POS page
export const handleFetchPosPage = async (req, res) => {
  const isAuthenticated = req.session?.userId;
  const createdBy = req.session.userId;
  const userName = req.session?.userName;

  try {
    console.info(`User "${userName} (${createdBy})" fetched POS page.`);
    const page = await fetchPosPage2(createdBy);
    const products = await fetchProducts();

    sendSuccessResponse(res, 201, { page, products }, isAuthenticated);
  } catch (err) {
    sendErrorResponse(
      res,
      500,
      err.message,
      err.title || "Failed to fetch POS page",
      isAuthenticated,
      err.stack || new Error().stack
    );
  }
};

// Void transaction
export const handleVoidTransaction = async (req, res) => {
  const created_by = req.session.userId;
  const isAuthenticated = req.session?.userId;

  try {
    // Delegate to service
    await voidTransaction(created_by);

    sendSuccessResponse(res, 200, {}, isAuthenticated);
  } catch (err) {
    sendErrorResponse(
      res,
      500,
      "Failed to void transaction",
      err.message,
      isAuthenticated,
      err.stack || new Error().stack
    );
  }
};

// Void Line
export const handleVoidTransactionLine = async (req, res) => {
  const createdBy = req.session.userId;
  const isAuthenticated = req.session?.userId;
  const { lineNo } = req.body;

  try {
    await voidTransactionLine(createdBy, lineNo);

    sendSuccessResponse(res, 200, {}, isAuthenticated);
  } catch (err) {
    sendErrorResponse(
      res,
      500,
      err.message,
      err.title || "Failed to void line",
      isAuthenticated,
      err.stack || new Error().stack
    );
  }
};

// Update cart table
export const handleAlterCartProduct = async (req, res) => {
  const { lineNo, field, updatedValue } = req.body;
  const creaedBy = req.session?.userId;
  const isAuthenticated = !!creaedBy;

  try {
    // Delegate the update logic to the service
    await alterCartProduct(lineNo, field, updatedValue, creaedBy);

    // Respond with success
    sendSuccessResponse(res, 200, {}, isAuthenticated);
  } catch (err) {
    sendErrorResponse(
      res,
      err.status || 500,
      err.message,
      err.title || "Failed to update cart",
      isAuthenticated,
      err.stack || new Error().stack
    );
  }
};

// Update transaction info (including cx account) from POS page
export const handleAlterTransactionHeader = async (req, res) => {
  const { field, updatedValue } = req.body;
  const createdBy = req.session.userId;
  const isAuthenticated = req.session?.userId;

  try {
    await alterTransactionHeader2(field, updatedValue, createdBy);
    sendSuccessResponse(res, 200, {}, isAuthenticated);
  } catch (err) {
    sendErrorResponse(
      res,
      err.status || 500,
      err.message,
      err.title || "Failed to update header",
      isAuthenticated,
      err.stack || new Error().stack
    );
  }
};

export const handleCreateOrder = async (req, res) => {
  const createdBy = req.session.userId;
  const isAuthenticated = req.session.userId;

  try {
    await createCustomerOrder(createdBy);

    sendSuccessResponse(res, 200, {}, isAuthenticated);
  } catch (err) {
    sendErrorResponse(
      res,
      err.status || 500,
      err.message,
      err.title || "An unnexpected error occured",
      isAuthenticated,
      err.stack || new Error().stack
    );
  }
};
