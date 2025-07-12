//
// server/back-end/controllers/co.controllers.js

import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseHelper.js";

import { addPayment } from "../services/co/addPayment.js";
import { shipReadyCoLines } from "../services/customerOrders/shipReadyCoLines.js";
import { fetchViewOrderLines } from "../services/customerOrders/fetchViewOrderLines.js";
import { alterOrder } from "../services/customerOrders/alterOrder.js";
import { cancelCoLine } from "../services/customerOrders/cancelCoLine.js";
import { addCustomerOrderLine } from "../services/customerOrders/addCustomerOrderLine.js";

import { fetchViewOrderCard } from "../services/customerOrders/fetchViewOrderCard.js";

import { fetchMapOrderHeaders } from "../services/customerOrders/fetchMapOrderHeaders.js";

export const handleFetchCoCard = async (req, res) => {
  const isAuthenticated = req.session.userId;
  const { order_no: orderNo } = req.params;

  const parsedOrderNo = parseFloat(orderNo);

  try {
    const customerOrderCard = await fetchViewOrderCard(parsedOrderNo);

    sendSuccessResponse(res, 200, { customerOrderCard }, isAuthenticated);
  } catch (err) {
    sendErrorResponse(
      res,
      err.status || 500,
      err.title || "Failed to fetch customer order card",
      err.message,
      isAuthenticated,
      err.stack || new Error().stack
    );
  }
};

export const handleAddPayment = async (req, res) => {
  const isAuthenticated = req.session.userId;
  const createdBy = req.session.userId;
  const { orderNo, paymentMethod, paymentAmount } = req.body;

  try {
    await addPayment(createdBy, orderNo, paymentMethod, paymentAmount);

    sendSuccessResponse(res, 201, {}, isAuthenticated);
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

export const handleFetchOrdersList = async (req, res) => {
  const isAuthenticated = req.session.userId;

  const { orderNo = null, active = null, shipped = null } = req.query;

  try {
    const ordersList = await fetchViewOrderLines(
      null,
      null,
      parseFloat(orderNo),
      null,
      null,
      parseFloat(active),
      parseFloat(shipped)
    );

    sendSuccessResponse(res, 200, { ordersList }, isAuthenticated);
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

export const handleShipCustomerOrder = async (req, res) => {
  const isAuthenticated = req.session.userId;
  const createdBy = req.session.userId;
  const { orderNo } = req.body;

  try {
    // await shipCustomerOrder(createdBy, orderNo);
    await shipReadyCoLines(createdBy, orderNo);

    sendSuccessResponse(res, 201, {}, isAuthenticated);
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

export const handleFetchCustomerOrders = async (req, res) => {
  const isAuthenticated = req.session.userId;

  try {
    // Extract filters from query parameters
    const { quote, posted, orderNo } = req.query;

    // Convert "1"/"0" strings to boolean (or keep as null if empty)
    const parsedQuote = quote === "true" ? 1 : quote === "false" ? 0 : null;
    const parsedPosted = posted === "true" ? 1 : posted === "false" ? 0 : null;

    const groupedOrders = await fetchMapOrderHeaders(
      parsedQuote,
      parsedPosted,
      null
    ); //quote, posted, orderNo

    sendSuccessResponse(res, 200, { groupedOrders }, isAuthenticated);
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

export const handleAlterOrder = async (req, res) => {
  const { field, updatedValue } = req.body;
  const { order_no: orderNo } = req.params;
  const isAuthenticated = req.session?.userId;
  try {
    await alterOrder(orderNo, field, updatedValue);

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

export const handleCancelCoLine = async (req, res) => {
  const isAuthenticated = req.session?.userId;
  const createdBy = req.session?.userId;
  const { orderNo, lineNo, paymentMethod } = req.body;

  try {
    await cancelCoLine(
      createdBy,
      parseFloat(orderNo),
      parseFloat(lineNo),
      parseFloat(paymentMethod)
    );
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

export const handleAddCustomerOrderLine = async (req, res) => {
  const isAuthenticated = req.session?.userId;
  const createdBy = req.session?.userId;
  const { orderNo, itemNo, quantity, attribute = [] } = req.body;

  try {
    await addCustomerOrderLine(
      parseFloat(orderNo),
      itemNo,
      quantity,
      attribute,
      createdBy
    );

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
