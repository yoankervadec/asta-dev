//
// server/back-end/controllers/products.controllers.js

import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseHelper.js";

import { fetchProducts } from "../services/products/fetchProducts.js";
import { createProduct } from "../services/products/createProduct.js";
import { alterProduct } from "../services/products/alterProduct.js";
import { fetchViewOrderLines } from "../services/customerOrders/fetchViewOrderLines.js";
import { fetchWorkSession } from "../services/production/fetchWorkSession.js";

// Fetch all products
export const handleFetchAllProducts = async (req, res) => {
  const isAuthenticated = req.session?.userId;

  try {
    const products = await fetchProducts();
    sendSuccessResponse(res, 201, { products }, isAuthenticated);
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

// Create new product
export const handleCreateProduct = async (req, res) => {
  const isAuthenticated = req.session?.userId;
  const created_by = req.session.userId;

  // Extract product details from request body
  const {
    item_no,
    description,
    type,
    pp_thousand,
    thickness,
    width,
    length,
    cost,
  } = req.body;

  // Validate that all required fields are present
  if (
    !item_no ||
    !description ||
    !type ||
    !pp_thousand ||
    !thickness ||
    !width ||
    !length
  ) {
    return sendErrorResponse(
      res,
      400,
      "Missing required fields",
      "",
      isAuthenticated
    );
  }

  try {
    // Delegate to the service layer
    await createProduct({
      item_no,
      description,
      type,
      pp_thousand,
      thickness,
      width,
      length,
      cost,
      created_by,
    });

    sendSuccessResponse(res, 200, {}, isAuthenticated);
  } catch (err) {
    const status = err.message.includes("already exists") ? 400 : 500;
    sendErrorResponse(res, status, err.message, "", isAuthenticated);
  }
};

// Alter existing product
export const handleAlterProduct = async (req, res) => {
  const isAuthenticated = req.session?.userId;
  const { itemNo } = req.params;
  const { field, updatedValue } = req.body;

  try {
    // Delegate the business logic to the service layer
    await alterProduct(itemNo, field, updatedValue);

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

export const handleFetchProductCard = async (req, res) => {
  const isAuthenticated = req.session?.userId;
  const { itemNo } = req.params;

  try {
    const customerOrders = await fetchViewOrderLines(null, 0, null, itemNo); // Not posted
    const productInfo = await fetchProducts(itemNo);
    const sessionInfo = await fetchWorkSession(itemNo);

    sendSuccessResponse(
      res,
      201,
      { customerOrders, productInfo, sessionInfo },
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
