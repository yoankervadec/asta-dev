//
// server/jobs/schedulers/schedulers.js

import { updateWorkTable } from "../tracked/updateWorkTable.js";
import { updateLinesStatus } from "../tracked/updateLinesStatus.js";
import { handleReservations } from "../tracked/handleReservations.js";
import { updateInventorySummary } from "../tracked/updateInventorySummary.js";
import { postCustomerOrders } from "../tracked/postCustomerOrders.js";
import { allocateReservations } from "../tracked/allocateReservations.js";

import Scheduler from "../manager/Scheduler.js";

// Initialize variable to database job name
const updateWorkTableJob = "updateWorkTable";
const updateOrderLinesStatusJob = "updateLinesStatus";
const allocateReservationsJob = "allocateReservations";
const updateInventorySummaryJob = "updateInventorySummary";
const postCustomerOrdersJob = "postCustomerOrders";

// Create schedule instance:
//  jobName:      database name
//  executeTask:  function
const scheduler = new Scheduler([
  // { jobName: allocateReservationsJob, executeTask: handleReservations },
  { jobName: allocateReservationsJob, executeTask: allocateReservations },
  { jobName: updateOrderLinesStatusJob, executeTask: updateLinesStatus },
  { jobName: updateInventorySummaryJob, executeTask: updateInventorySummary },
  { jobName: updateWorkTableJob, executeTask: updateWorkTable },
  { jobName: postCustomerOrdersJob, executeTask: postCustomerOrders },
]);

export default scheduler;
