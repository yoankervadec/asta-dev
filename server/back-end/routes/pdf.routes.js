// 
// server/back-end/routes/pdf.routes.js

import express from "express";

import { generatePDFController } from "../controllers/pdf.controllers.js";
import { handleGeneratePdfForOrder } from "../controllers/pdf.controllers.js";

const router = express.Router();

router.post("/generate-pdf", generatePDFController);
router.post("/pdf-order", handleGeneratePdfForOrder)


export default router;
