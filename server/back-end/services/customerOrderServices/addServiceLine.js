//
// server/back-end/services/customerOrderServices/addServiceLine.js

import scheduler from "../../../jobs/schedulers/schedulers.js";

import { fetchViewOrderLines } from "../customerOrders/fetchViewOrderLines.js";
import { selectServiceConfig } from "../../models/customerOrderServices/selectServiceConfig.js";
import { insertServiceLine } from "../../models/customerOrderServices/insertServiceLine.js";

import { AppError } from "../../utils/errorHandling/AppError.js";

export const addServiceLine = async (orderNo, lineNo, serviceId) => {
  try {
    if (orderNo === undefined || orderNo === null || isNaN(Number(orderNo))) {
      throw new AppError(
        400,
        `Order number "${orderNo}" invalid.`,
        "Invalid Parameters."
      );
    }
    if (lineNo === undefined || lineNo === null || isNaN(Number(lineNo))) {
      throw new AppError(
        400,
        `Line number "${lineNo}" invalid.`,
        "Invalid Parameters."
      );
    }
    if (
      serviceId === undefined ||
      serviceId === null ||
      isNaN(Number(serviceId))
    ) {
      throw new AppError(
        400,
        `Service ID "${serviceId}" invalid.`,
        "Invalid Parameters."
      );
    }

    // Fetch order line details
    const orderLines = await fetchViewOrderLines(null, null, orderNo);
    const processLine = orderLines.filter(
      (line) =>
        line.lineNo === lineNo &&
        line.status.shipped === 0 &&
        line.status.active === 1 &&
        line.status.posted === 0
    );

    if (processLine.length !== 1) {
      throw new AppError(400, "Cannot determine which line to process.");
    }

    // Extract line and fields
    const line = processLine[0];
    const existingAttributes = line.item.attributes;
    const existingServices = line.services.services || [];

    // Fetch service configuration
    const [serviceConfig] = await selectServiceConfig(serviceId);
    if (!serviceConfig) {
      throw new AppError(400, "Service configuration not found.");
    }
    const serviceAttributes = serviceConfig.add_attributes || [];

    // Check if requested service is allowed
    const hasConflictAttribute = existingAttributes.some((attr) =>
      serviceAttributes.includes(attr.attrId)
    );
    if (hasConflictAttribute) {
      throw new AppError(
        400,
        "This service cannot be added due to conflicting attribute(s)."
      );
    }
    const hasServiceExists = existingServices.some(
      (s) => s.serviceId === serviceId
    );
    if (hasServiceExists) {
      throw new AppError(
        400,
        "This service has already been added to the line."
      );
    }

    // Insert service line
    await insertServiceLine(orderNo, lineNo, serviceId);

    scheduler.triggerJob("updateLinesStatus", { orderNo: [orderNo] });
  } catch (error) {
    throw error;
  }
};
