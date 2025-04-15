//
// server/back-end/services/co/addPayment.js

import { getConnection } from "../../configs/db.config.js";

import { fetchMapOrderHeaders } from "../customerOrders/fetchMapOrderHeaders.js";

import { insertTransaction } from "../../models/transactions/insertTransaction.js";
import { insertPaymentEntry } from "../../models/paymentEntries/insertPaymentEntry.js";

import { AppError } from "../../utils/errorHandling/AppError.js";

// Add payment (transaction + payment entry) for existing order

export const addPayment = async (
  createdBy,
  orderNo,
  paymentMethod,
  paymentAmount
) => {
  const connection = await getConnection();

  try {
    const parsedPaymentAmount = parseFloat(paymentAmount);
    const parsedPaymentMethod = parseFloat(paymentMethod);
    const parsedOrderNo = parseFloat(orderNo);
    const transactionType = 3; // always Payment

    const rawOrderData = await fetchMapOrderHeaders(null, null, parsedOrderNo);
    const { customer, totals } = rawOrderData[0];

    // Validate payment amount before proceeding
    if (
      parsedPaymentAmount === undefined ||
      parsedPaymentAmount === null ||
      isNaN(Number(parsedPaymentAmount)) ||
      Number(parsedPaymentAmount) <= 0
    ) {
      throw new AppError(
        400,
        `Invalid payment amount: ${parsedPaymentAmount}`,
        "Failed"
      );
    }
    if (
      parsedPaymentMethod === undefined ||
      parsedPaymentMethod === null ||
      isNaN(Number(parsedPaymentMethod))
    ) {
      throw new AppError(400, `Invalid payment method.`, "Failed");
    }

    if (parsedPaymentAmount > totals.balanceAsDecimal) {
      throw new AppError(
        400,
        `Payment amount "${parsedPaymentAmount}" exceeds remaining balance "${totals.balanceAsDecimal}".`,
        "Failed"
      );
    }

    await connection.beginTransaction();

    // create transaction and payment entry
    const transactionId = await insertTransaction(
      connection,
      parsedOrderNo,
      transactionType,
      createdBy
    );

    await insertPaymentEntry(
      connection,
      transactionId,
      parsedOrderNo,
      customer.clientId,
      parsedPaymentAmount,
      parsedPaymentMethod
    );

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    console.error(error);
    throw error;
  } finally {
    connection.release();
  }
};
