//
// server/back-end/services/customerOrderServices/processAndCompleteService.js

import { fetchViewOrderLines } from "../customerOrders/fetchViewOrderLines.js";
import { selectServiceConfig } from "../../models/customerOrderServices/selectServiceConfig.js";
import { insertItemEntry } from "../../models/itemEntries/insertItemEntry.js";
import { insertItemEntryAttribute } from "../../models/itemEntries/insertItemEntryAttribute.js";
import { insertCustomerOrderLineAttribute } from "../../models/customerOrders/insertCustomerOrderLineAttribute.js";
import { deleteCustomerOrderLineAttribute } from "../../models/customerOrders/deleteCustomerOrderLineAttribute.js";
import { updateServiceLine } from "../../models/customerOrderServices/updateServiceLine.js";

import { getConnection } from "../../configs/db.config.js";
import { AppError } from "../../utils/errorHandling/AppError.js";

export const processAndCompleteService = async (orderNo, lineNo, serviceId) => {
  const connection = await getConnection();
  const WAREHOUSE_ID = 1; // YARD

  try {
    await connection.beginTransaction();

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

    // Fetch order details
    const orderLines = await fetchViewOrderLines(null, null, orderNo);
    const processLine = orderLines.filter(
      (line) =>
        line.lineNo === lineNo &&
        line.services?.services?.some((s) => s.serviceId === serviceId) &&
        line.status.shipped === 0 &&
        line.status.active === 1 &&
        line.status.posted === 0
    );

    if (processLine.length !== 1) {
      throw new AppError(400, "Cannot determine which line to process.");
    }

    // Extract line and fields
    const line = processLine[0];
    // Reject if line not ready
    if (line.status.statusCode !== 1) {
      throw new AppError(
        400,
        "Service cannot be processed until the line is ready."
      );
    }

    // Check if the service was already completed
    const serviceToCheck = line.services.services.find(
      (s) => s.serviceId === serviceId
    );

    if (!serviceToCheck) {
      throw new AppError(400, "Service not found on this line.");
    }

    if (serviceToCheck.completed === 1) {
      throw new AppError(400, "This service has already been completed.");
    }

    const itemNo = line.item.itemNo;
    const quantity = line.item.quantity;
    const currentAttributes = line.item.attributes || [];

    // Fetch service configuration
    const [serviceConfig] = await selectServiceConfig(serviceId);
    if (!serviceConfig) {
      throw new AppError(400, "Service configuration not found.");
    }
    const removeAttributes = serviceConfig.removes_attributes || [];
    const addAttributes = serviceConfig.add_attributes || [];

    // Handle inventory movement if required
    if (currentAttributes.length > 0) {
      const ITEM_ENTRY_TYPE = 5; // Negative

      const entryNo = await insertItemEntry(
        connection,
        WAREHOUSE_ID,
        null,
        ITEM_ENTRY_TYPE,
        itemNo,
        -Math.abs(quantity), // Negative quantity
        0,
        orderNo
      );
      for (const attribute of currentAttributes) {
        await insertItemEntryAttribute(connection, entryNo, attribute.attrId);
      }
    }
    if (addAttributes.length > 0 || removeAttributes.length > 0) {
      const ITEM_ENTRY_TYPE = 4; // Positive

      const entryNo = await insertItemEntry(
        connection,
        WAREHOUSE_ID,
        null,
        ITEM_ENTRY_TYPE,
        itemNo,
        quantity,
        0,
        orderNo
      );
      // Original attributes from line
      const originalAttrs =
        line.item.attributes?.map((attr) => attr.attrId) || [];

      // Remove attributes
      const removedAttrs = new Set(removeAttributes);

      // Add attributes
      const addedAttrs = new Set(addAttributes);

      // Final set = (original - removed) + added
      const finalAttrsSet = new Set(
        originalAttrs.filter((attr) => !removedAttrs.has(attr))
      );

      for (const attr of addedAttrs) {
        finalAttrsSet.add(attr);
      }

      // Sort final attribute IDs numerically
      const sortedAttrIds = [...finalAttrsSet].sort((a, b) => a - b);

      for (const attrId of sortedAttrIds) {
        await insertItemEntryAttribute(connection, entryNo, attrId);
      }
    }

    // Delete and Insert required attributes from order
    if (removeAttributes.length > 0) {
      for (const attribute of removeAttributes) {
        await deleteCustomerOrderLineAttribute(
          connection,
          orderNo,
          lineNo,
          attribute
        );
      }
    }
    if (addAttributes.length > 0) {
      for (const attribute of addAttributes) {
        await insertCustomerOrderLineAttribute(
          connection,
          orderNo,
          lineNo,
          attribute
        );
      }
    }

    // Set the service line to completed
    await updateServiceLine(
      connection,
      orderNo,
      lineNo,
      serviceId,
      "completed",
      true
    );

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
