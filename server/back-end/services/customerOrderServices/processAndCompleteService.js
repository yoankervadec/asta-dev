//
// server/back-end/services/customerOrderServices/processAndCompleteService.js

import { fetchViewOrderLines } from "../customerOrders/fetchViewOrderLines.js";

import { selectServiceConfig } from "../../models/customerOrderServices/selectServiceConfig.js";
import { insertItemEntry } from "../../models/itemEntries/insertItemEntry.js";
import { insertItemEntryAttribute } from "../../models/itemEntries/insertItemEntryAttribute.js";
import { insertCustomerOrderLineAttribute } from "../../models/customerOrders/insertCustomerOrderLineAttribute.js";
import { deleteCustomerOrderLineAttribute } from "../../models/customerOrders/deleteCustomerOrderLineAttribute.js";

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

    const line = processLine[0];
    // Reject if line not ready
    if (line.status.statusCode !== 1) {
      throw new AppError(
        400,
        "Service cannot be processed until the line is ready."
      );
    }
    const itemNo = line.item.itemNo;
    const quantity = line.item.quantity;

    // Fetch service configuration
    const [serviceConfig] = await selectServiceConfig(serviceId);
    if (!serviceConfig) {
      throw new AppError(400, "Service configuration not found.");
    }
    const removeAttributes = serviceConfig.remove_attributes || []; // [1, 4]
    const addAttributes = serviceConfig.add_attributes || []; // [ 2, 6, 8]

    // Handle inventory movement if required
    if (removeAttributes.length > 0) {
      const ITEM_ENTRY_TYPE = 5; // Negative

      const entryNo = await insertItemEntry(
        connection,
        WAREHOUSE_ID,
        null,
        ITEM_ENTRY_TYPE,
        itemNo,
        quantity,
        null,
        orderNo
      );
      for (const attribute of removeAttributes) {
        await insertItemEntryAttribute(connection, entryNo, attribute);
      }
    }

    if (addAttributes.length > 0) {
      const ITEM_ENTRY_TYPE = 4; // Positive

      const entryNo = await insertItemEntry(
        connection,
        WAREHOUSE_ID,
        null,
        ITEM_ENTRY_TYPE,
        itemNo,
        quantity,
        null,
        orderNo
      );
      for (const attribute of addAttributes) {
        await insertItemEntryAttribute(connection, entryNo, attribute);
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

    await connection.rollback();
    // await connection.commit();
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
};
