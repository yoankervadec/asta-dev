//
// server/back-end/routes/scheduler.routes.js

import express from "express";
import { schedulerController } from "../controllers/scheduler.controllers.js";

const router = express.Router();

router.post("/start-all", schedulerController.startAllJobs);
router.post("/stop-all", schedulerController.stopAllJobs);
router.post("/trigger/:jobName", schedulerController.triggerJob);

export default router;
