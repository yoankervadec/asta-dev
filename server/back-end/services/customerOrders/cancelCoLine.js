//
// server/back-end/services/customerOrders/cancelCoLine.js

import { getConnection } from "../../configs/db.config.js";
import { AppError } from "../../utils/errorHandling/AppError.js";

import { fetchViewOrderCard } from "./fetchViewOrderCard.js";
import { updateCancelCoLine } from "../../models/customerOrders/updateCancelCoLine.js";
import { insertTransaction } from "../../models/transactions/insertTransaction.js";
import { insertPaymentEntry } from "../../models/paymentEntries/insertPaymentEntry.js";

import { isValidNumberOrNull } from "../../utils/typeCheck/typeCheck.js";

export const cancelCoLine = async (
  createdBy,
  orderNo,
  lineNo,
  paymentMethod = null
) => {
  const connection = await getConnection();
  const TRANSACTION_TYPE = 3; // Payment
  try {
    // Validation
    if (!isValidNumberOrNull(orderNo) || !isValidNumberOrNull(lineNo)) {
      throw new AppError(
        400,
        "Invalid parameters, please try again.",
        "Invalid Parameters"
      );
    }

    await connection.beginTransaction();

    // Get order information
    const { orderHeader, orderLines } = await fetchViewOrderCard(orderNo);
    const clientId = orderHeader.customer.clientId;
    const canceledLine = orderLines.find((line) => line.lineNo === lineNo);

    // Get canceled line total, balance and payment amount
    const canceledAmount = canceledLine.pricing.lineTotalAsDecimal;
    const balance = orderHeader.totals.balanceAsDecimal;
    const paymentAmount = orderHeader.totals.paymentAmountAsDecimal;

    // Error if line already canceled or shipped
    if (canceledLine.status.active === 0 || canceledLine.status.shipped === 1) {
      throw new AppError(
        400,
        "This line is already canceled/shipped.",
        `Order: ${orderNo} at line: ${lineNo}.`
      );
    }

    // Perform refund if required
    if (canceledAmount > balance) {
      const paymentDifference = Math.max(
        -paymentAmount, // avoid refunding over payment amount
        balance - canceledAmount
      );
      const transactionId = await insertTransaction(
        connection,
        orderNo,
        TRANSACTION_TYPE,
        createdBy
      );
      if (!transactionId) {
        throw new AppError(
          500,
          "Failed to process Transaction.",
          "Operation Failed."
        );
      }
      if (!paymentMethod) {
        throw new AppError(
          500,
          "The Payment Method is invalid.",
          "Operation Failed"
        );
      }
      await insertPaymentEntry(
        connection,
        transactionId,
        orderNo,
        clientId,
        paymentDifference,
        paymentMethod
      );
    }

    // Update status to canceled
    await updateCancelCoLine(connection, orderNo, lineNo);

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
