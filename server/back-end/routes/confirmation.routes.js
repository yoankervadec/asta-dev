//
// server/back-end/routes/confirmation.routes.js

import { handleRequestConfirmation } from "../controllers/confirmation.controllers.js";

import express from "express";

const router = express.Router();

router.post("/request/:action", handleRequestConfirmation);

export default router;
