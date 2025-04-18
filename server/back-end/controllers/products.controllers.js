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
  const createdBy = req.session.userId;

  // Extract product details from request body
  const {
    itemNo,
    description,
    type,
    pricePerThousand,
    thickness,
    width,
    length,
    cost,
  } = req.body;

  try {
    await createProduct(
      itemNo,
      description,
      type,
      pricePerThousand,
      thickness,
      width,
      length,
      cost,
      createdBy
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
