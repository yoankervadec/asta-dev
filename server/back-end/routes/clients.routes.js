//
// server/back-end/routes/clients.routes.js

import express from "express";

import {
  handleFetchAllClients,
  handleAlterClientTransactionHeader,
  handleCreateClient,
  handleFetchClientCard,
} from "../controllers/clients.controllers.js";

const router = express.Router();

router.get("/clients", handleFetchAllClients);
router.post("/new-client", handleCreateClient);
router.post("/select-client", handleAlterClientTransactionHeader);
router.get("/client-card/:clientId", handleFetchClientCard);

export default router;
