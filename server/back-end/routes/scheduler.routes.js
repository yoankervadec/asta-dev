//
// server/back-end/routes/scheduler.routes.js

import express from "express";

import {
  handleStartOrderLinesStatusScheduler,
  handleStopOrderLinesStatusScheduler,
  handleTriggerOrderLinesStatusScheduler,
  handleStartWorkTableScheduler,
  handleStopWorkTableScheduler,
  handleTriggerWorkTableScheduler,
  handleStartAllocateReservationsScheduler,
  handleStopAllocateReservationsScheduler,
  handleTriggerAllocateReservationsScheduler,
  handleStartUpdateInventorySummaryScheduler,
  handleStopUpdateInventorySummaryScheduler,
  handleTriggerUpdateInventorySummaryScheduler,
  handleStartPostCustomerOrdersScheduler,
  handleStopPostCustomerOrdersScheduler,
  handleTriggerPostCustomerOrdersScheduler,
} from "../controllers/scheduler.controllers.js";

const router = express.Router();

router.post("/status/start", handleStartOrderLinesStatusScheduler);
router.post("/status/stop", handleStopOrderLinesStatusScheduler);
router.post("/status/trigger", handleTriggerOrderLinesStatusScheduler);
router.post("/work/start", handleStartWorkTableScheduler);
router.post("/work/stop", handleStopWorkTableScheduler);
router.post("/work/trigger", handleTriggerWorkTableScheduler);
router.post("/res/start", handleStartAllocateReservationsScheduler);
router.post("/res/stop", handleStopAllocateReservationsScheduler);
router.post("/res/trigger", handleTriggerAllocateReservationsScheduler);
router.post("/inv/start", handleStartUpdateInventorySummaryScheduler);
router.post("/inv/stop", handleStopUpdateInventorySummaryScheduler);
router.post("/inv/trigger", handleTriggerUpdateInventorySummaryScheduler);
router.post("/post/start", handleStartPostCustomerOrdersScheduler);
router.post("/post/stop", handleStopPostCustomerOrdersScheduler);
router.post("/post/trigger", handleTriggerPostCustomerOrdersScheduler);

export default router;
