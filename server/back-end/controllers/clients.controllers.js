//
// server/back-end/controllers/clients.controllers.js

import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseHelper.js";

import { fetchAllClients } from "../services/clients/fetchAllClients.js";
import { alterClientTransactionHeader } from "../services/clients/alterClientTransactionHeader.js";
import { createClient } from "../services/clients/createClient.js";
import { fetchMapOrderHeaders } from "../services/customerOrders/fetchMapOrderHeaders.js";

export const handleFetchAllClients = async (req, res) => {
  const isAuthenticated = req.session?.userId;

  try {
    const clients = await fetchAllClients();

    sendSuccessResponse(res, 201, { clients }, isAuthenticated);
  } catch (err) {
    sendErrorResponse(
      res,
      500,
      "Failed to fetch clients",
      err.message,
      isAuthenticated
    );
  }
};

export const handleAlterClientTransactionHeader = async (req, res) => {
  const isAuthenticated = req.session.userId;
  const { clientId } = req.body;
  const createdBy = req.session.userId;

  try {
    await alterClientTransactionHeader(clientId, createdBy);

    sendSuccessResponse(res, 200, {}, isAuthenticated);
  } catch (err) {
    sendErrorResponse(
      res,
      500,
      "Failed to select client1",
      err.message,
      isAuthenticated
    );
  }
};

export const handleCreateClient = async (req, res) => {
  const isAuthenticated = req.session.userId;
  const createdBy = req.session.userId;

  const {
    name,
    name2,
    phone,
    phone2,
    email,
    address,
    city,
    postal_code,
    extra,
  } = req.body;

  try {
    await createClient(
      name,
      name2,
      phone,
      phone2,
      email,
      address,
      city,
      postal_code,
      extra,
      createdBy
    );

    sendSuccessResponse(res, 201, {}, isAuthenticated);
  } catch (err) {
    sendErrorResponse(
      res,
      err.status || 500,
      err.message,
      err.title || "An unnexpected error occured",
      isAuthenticated
    );
  }
};

export const handleFetchClientCard = async (req, res) => {
  const isAuthenticated = req.session?.userId;
  const { clientId } = req.params;
  try {
    const orders = await fetchMapOrderHeaders(
      null,
      null,
      null,
      parseFloat(clientId)
    );
    const client = await fetchAllClients(parseFloat(clientId));
    // fetch client info
    sendSuccessResponse(res, 200, { orders, client }, isAuthenticated);
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
