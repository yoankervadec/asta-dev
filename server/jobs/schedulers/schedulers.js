//
// server/jobs/schedulers/schedulers.js

import SchedulerManager from "./schedulerManager.js";
import { updateWorkTable } from "../updateWorkTable.js";
import { updateLinesStatus } from "../updateLinesStatus.js";
import { handleReservations } from "../handleReservations.js";
import { updateInventorySummary } from "../updateInventorySummary.js";
import { postCustomerOrders } from "../postCustomerOrders.js";

// Start all
export const startAllSchedulers = () => {
  workTableScheduler.start();
  orderLinesStatusScheduler.start();
  allocateReservationsScheduler.start();
  updateInventorySummaryScheduler.start();
  postCustomerOrdersScheduler.start();
};

// Stop all
export const stopAllSchedulers = () => {
  workTableScheduler.stop();
  orderLinesStatusScheduler.stop();
  allocateReservationsScheduler.stop();
  updateInventorySummaryScheduler.stop();
  postCustomerOrdersScheduler.stop();
};

const updateWorkTableJob = "updateWorkTable";
const updateOrderLinesStatusJob = "updateLinesStatus";
const allocateReservationsJob = "allocateReservations";
const updateInventorySummaryJob = "updateInventorySummary";
const postCustomerOrdersJob = "postCustomerOrders";

const separator = "\n" + "─".repeat(50); // Horizontal line

export const workTableScheduler = new SchedulerManager(
  updateWorkTableJob,
  async () => {
    try {
      await updateWorkTable();
      const timestamp = new Date().toLocaleString("en-CA", {
        timeZone: "America/Toronto",
      });
      console.log(`[${timestamp}] SUCCESS: Work table updated successfully.`);
    } catch (error) {
      console.error("Failed to update work table:", error.message);
    }
  }
);

export const orderLinesStatusScheduler = new SchedulerManager(
  updateOrderLinesStatusJob,
  async () => {
    try {
      const { rowsAffected, executionTime } = await updateLinesStatus();
      const timestamp = new Date().toLocaleString("en-CA", {
        timeZone: "America/Toronto",
      });
      console.log(
        `[${timestamp}] SUCCESS: Status V2 updated successfully.\n` +
          `Rows Affected: ${rowsAffected}, Execution Time: ${executionTime}\n` +
          `${separator}`
      );
    } catch (error) {
      console.error("Failed to update status:", error.message);
    }
  }
);

export const allocateReservationsScheduler = new SchedulerManager(
  allocateReservationsJob,
  async () => {
    try {
      const { rowsDeleted, rowsInserted, executionTime } =
        await handleReservations();
      const timestamp = new Date().toLocaleString("en-CA", {
        timeZone: "America/Toronto",
      });
      console.log(
        `[${timestamp}] SUCCESS: Reservations allocated successfully.\n` +
          `Reservations Deleted: ${rowsDeleted}, New Reservations: ${rowsInserted}, Execution Time: ${executionTime}\n` +
          `${separator}`
      );
    } catch (error) {
      console.error("Failed to allocate reservations:", error.message);
    }
  }
);

export const updateInventorySummaryScheduler = new SchedulerManager(
  updateInventorySummaryJob,
  async () => {
    try {
      const { rowsAffected, executionTime } = await updateInventorySummary();
      const timestamp = new Date().toLocaleString("en-CA", {
        timeZone: "America/Toronto",
      });
      console.log(
        `[${timestamp}] SUCCESS: Inventory updated successfully.\n` +
          `Rows Affected: ${rowsAffected}, Execution Time: ${executionTime}\n` +
          `${separator}`
      );
    } catch (error) {
      console.error("Failed to update inventory:", error.message);
    }
  }
);

export const postCustomerOrdersScheduler = new SchedulerManager(
  postCustomerOrdersJob,
  async () => {
    try {
      const { executionTime, ordersListUpdated, ordersUpdated } =
        await postCustomerOrders();
      const timestamp = new Date().toLocaleString("en-CA", {
        timeZone: "America/Toronto",
      });
      console.log(
        `[${timestamp}] SUCCESS: Orders posted successfully.\n` +
          `Lines Affected: ${ordersListUpdated}, Orders Affected: ${ordersUpdated},\n` +
          `Execution Time: ${executionTime}\n` +
          `${separator}`
      );
    } catch (error) {
      console.error("Failed to post orders:", error.message);
    }
  }
);
