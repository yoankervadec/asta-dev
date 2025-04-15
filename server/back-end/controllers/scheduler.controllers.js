//
// server/back-end/controllers/scheduler.controllers.js

import {
  workTableScheduler,
  orderLinesStatusScheduler,
  allocateReservationsScheduler,
  updateInventorySummaryScheduler,
  postCustomerOrdersScheduler,
} from "../../jobs/schedulers/schedulers.js";

// Line Status Scheduler
export const handleStartOrderLinesStatusScheduler = async (req, res) => {
  try {
    orderLinesStatusScheduler.start();
    res.status(200).send("Scheduler started.");
  } catch (err) {
    console.log(err.message);
  }
};
export const handleStopOrderLinesStatusScheduler = async (req, res) => {
  try {
    orderLinesStatusScheduler.stop();
    res.status(200).send("Scheduler stopped.");
  } catch (err) {
    console.log(err.message);
  }
};
export const handleTriggerOrderLinesStatusScheduler = async (req, res) => {
  try {
    orderLinesStatusScheduler.triggerNow();
    res.status(200).send("Scheduler triggered manually.");
  } catch (err) {
    console.log(err.message);
    res.status(500).send(`Error triggering scheduler: ${err.message}`);
  }
};

// Work Table Scheduler
export const handleStartWorkTableScheduler = async (req, res) => {
  try {
    workTableScheduler.start();
    res.status(200).send("Scheduler started.");
  } catch (err) {
    console.log(err.message);
  }
};
export const handleStopWorkTableScheduler = async (req, res) => {
  try {
    workTableScheduler.stop();
    res.status(200).send("Scheduler stopped.");
  } catch (err) {
    console.log(err.message);
  }
};
export const handleTriggerWorkTableScheduler = async (req, res) => {
  try {
    workTableScheduler.triggerNow();
    res.status(200).send("Scheduler triggered manually.");
  } catch (err) {
    console.log(err.message);
    res.status(500).send(`Error triggering scheduler: ${err.message}`);
  }
};

// Allocate Reservations Scheduler
export const handleStartAllocateReservationsScheduler = async (req, res) => {
  try {
    allocateReservationsScheduler.start();
    res.status(200).send("Scheduler started.");
  } catch (err) {
    console.log(err.message);
  }
};
export const handleStopAllocateReservationsScheduler = async (req, res) => {
  try {
    allocateReservationsScheduler.stop();
    res.status(200).send("Scheduler stopped.");
  } catch (err) {
    console.log(err.message);
  }
};
export const handleTriggerAllocateReservationsScheduler = async (req, res) => {
  try {
    allocateReservationsScheduler.triggerNow();
    res.status(200).send("Scheduler triggered manually.");
  } catch (err) {
    console.log(err.message);
    res.status(500).send(`Error triggering scheduler: ${err.message}`);
  }
};

// Update inventory summary
export const handleStartUpdateInventorySummaryScheduler = async (req, res) => {
  try {
    updateInventorySummaryScheduler.start();
    res.status(200).send("Scheduler started.");
  } catch (err) {
    console.log(err.message);
  }
};
export const handleStopUpdateInventorySummaryScheduler = async (req, res) => {
  try {
    updateInventorySummaryScheduler.stop();
    res.status(200).send("Scheduler stopped.");
  } catch (err) {
    console.log(err.message);
  }
};
export const handleTriggerUpdateInventorySummaryScheduler = async (
  req,
  res
) => {
  try {
    updateInventorySummaryScheduler.triggerNow();
    res.status(200).send("Scheduler triggered manually.");
  } catch (err) {
    console.log(err.message);
    res.status(500).send(`Error triggering scheduler: ${err.message}`);
  }
};

// Post orders
export const handleStartPostCustomerOrdersScheduler = async (req, res) => {
  try {
    postCustomerOrdersScheduler.start();
    res.status(200).send("Scheduler started.");
  } catch (err) {
    console.log(err.message);
  }
};
export const handleStopPostCustomerOrdersScheduler = async (req, res) => {
  try {
    postCustomerOrdersScheduler.stop();
    res.status(200).send("Scheduler stopped.");
  } catch (err) {
    console.log(err.message);
  }
};
export const handleTriggerPostCustomerOrdersScheduler = async (req, res) => {
  try {
    postCustomerOrdersScheduler.triggerNow();
    res.status(200).send("Scheduler triggered manually.");
  } catch (err) {
    console.log(err.message);
    res.status(500).send(`Error triggering scheduler: ${err.message}`);
  }
};
