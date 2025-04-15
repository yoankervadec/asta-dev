// 
// server/back-end/routes/transactions.routes.js

import express from "express";

import { handleFetchAllTransactions } from "../controllers/transactions.controller.js";

const router = express.Router();

router.get("/transactions", handleFetchAllTransactions);

export default router;