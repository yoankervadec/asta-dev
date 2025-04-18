//
// server/back-end/routes/production.routes.js

import express from "express";

import {
  handleFetchWorkTable,
  handleAddWorkSessionLine,
  handlePostWorkSession,
  handleFetchSession,
} from "../controllers/production.controllers.js";

const router = express.Router();

router.get("/work-table", handleFetchWorkTable);
router.post("/session/add", handleAddWorkSessionLine);
router.post("/session/post", handlePostWorkSession);
router.get("/session/view", handleFetchSession);

export default router;
