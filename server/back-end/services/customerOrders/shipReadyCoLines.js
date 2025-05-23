//
// server/back-end/services/customerOrders/shipReadyCoLines.js

import { getConnection } from "../../configs/db.config.js";

import { fetchViewOrderLines } from "./fetchViewOrderLines.js";
import { insertTransaction } from "../../models/transactions/insertTransaction.js";
import { insertItemEntry } from "../../models/itemEntries/insertItemEntry.js";
import { insertItemEntryAttribute } from "../../models/itemEntries/insertItemEntryAttribute.js";
import { updateOrderLineStatus } from "../../models/customerOrders/updateOrderLineStatus.js";
import { insertInvoiceHeader } from "../../models/invoices/insertInvoiceHeader.js";
import { insertInvoiceLines } from "../../models/invoices/insertInvoiceLines.js";

import { AppError } from "../../utils/errorHandling/AppError.js";

export const shipReadyCoLines = async (createdBy, orderNo) => {
  const connection = await getConnection();
  const TRANSACTION_TYPE = 1; // Sale
  const WAREHOUSE_ID = 1; // YARD
  const ENTRY_TYPE = 1; // Sale (item entry)

  try {
    await connection.beginTransaction();
    // Validate orderNo
    if (orderNo === undefined || orderNo === null || isNaN(Number(orderNo))) {
      throw new AppError(
        400,
        `Order number "${orderNo}" invalid.`,
        "Invalid Parameters."
      );
    }

    // Get order lines details
    const orderLines = await fetchViewOrderLines(null, null, orderNo, null);

    // Get lines to ship
    const linesToShip = orderLines.filter(
      (line) =>
        line.status.shipped === 0 &&
        line.status.active === 1 &&
        line.status.statusCode === 1
    );

    if (linesToShip.length === 0) {
      throw new AppError(
        400,
        "No lines available to ship.",
        "Nothing to process"
      );
    }
    // Calculated shipped total
    const totalToShip = linesToShip.reduce(
      (acc, line) => acc + line.pricing.lineTotalAsDecimal,
      0
    );

    // Insert transaction
    const transactionId = await insertTransaction(
      connection,
      orderNo,
      TRANSACTION_TYPE,
      createdBy,
      totalToShip
    );

    // For each line, insert item entry and its attributes
    for (const line of linesToShip) {
      const {
        item,
        item: { itemNo, quantity, attributes },
      } = line;

      const entryNo = await insertItemEntry(
        connection,
        WAREHOUSE_ID,
        transactionId,
        ENTRY_TYPE,
        itemNo,
        -Math.abs(quantity) // Negative quantity
      );

      for (const attr of attributes) {
        await insertItemEntryAttribute(connection, entryNo, attr.attrId);
      }
    }

    // Update lines status
    for (const line of linesToShip) {
      const lineNo = line.lineNo;
      await updateOrderLineStatus(connection, orderNo, lineNo, "shipped", 1);
    }

    // Generate Invoice Header
    const invoiceNo = await insertInvoiceHeader(connection, orderNo, createdBy);

    // Second loop to insert Invoice Lines
    for (const line of linesToShip) {
      const { orderNo, lineNo } = line;

      await insertInvoiceLines(connection, invoiceNo, orderNo, lineNo);
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
