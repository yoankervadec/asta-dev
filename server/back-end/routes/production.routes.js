//
// server/back-end/routes/production.routes.js

import express from "express";

import {
  handleFetchWorkTable,
  handleAddWorkSessionLine,
  handlePostWorkSession,
} from "../controllers/production.controllers.js";

const router = express.Router();

router.get("/work-table", handleFetchWorkTable);
router.post("/session/add", handleAddWorkSessionLine);
router.post("/session/post", handlePostWorkSession);

export default router;
