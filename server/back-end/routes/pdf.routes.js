//
// server/back-end/routes/pdf.routes.js

import express from "express";

import {
  handleGenerateOrderPdf,
  handleGenerateInvoicePdf,
  handleGenerateProductionListPdf,
} from "../controllers/pdf.controllers.js";

const router = express.Router();

router.post("/order-card", handleGenerateOrderPdf);
router.post("/invoice", handleGenerateInvoicePdf);
router.post("/production-list", handleGenerateProductionListPdf);

export default router;
