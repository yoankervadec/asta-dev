//
// server/back-end/routes/services.routes.js

import {
  handleProcessAndCompleteService,
  handleAddServiceLine,
} from "../controllers/services.controllers.js";

import express from "express";

const router = express.Router();

router.post("/process-and-complete", handleProcessAndCompleteService);
router.post("/add-service", handleAddServiceLine);

export default router;
