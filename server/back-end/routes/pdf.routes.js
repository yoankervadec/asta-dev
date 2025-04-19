//
// server/back-end/routes/pdf.routes.js

import express from "express";

import { handleGenerateOrderPdf } from "../controllers/pdf.controllers.js";

const router = express.Router();

router.post("/order-card", handleGenerateOrderPdf);

export default router;
