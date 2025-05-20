//
// server/back-end/routes/services.routes.js

import { handleProcessAndCompleteService } from "../controllers/services.controllers.js";

import express from "express";

const router = express.Router();

router.post("/process-and-complete", handleProcessAndCompleteService);

export default router;
