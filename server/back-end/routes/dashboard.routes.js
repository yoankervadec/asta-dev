//
// server/back-end/routes/dashboard.routes.js

import express from "express";

import { handleFetchJobs } from "../controllers/dashboard.controllers.js";

const router = express.Router();

router.get("/jobs", handleFetchJobs);

export default router;
