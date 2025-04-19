//
// server/back-end/services/pos2/createCustomerOrder.js

import { getConnection } from "../../configs/db.config.js";
import { AppError } from "../../utils/errorHandling/AppError.js";

import { fetchPosPage2 } from "./fetchPosPage2.js";
import { insertCustomerOrder } from "../../models/customerOrders/insertCustomerOrder.js";
import { insertTransaction } from "../../models/transactions/insertTransaction.js";
import { insertPaymentEntry } from "../../models/paymentEntries/insertPaymentEntry.js";
import { insertCustomerOrderLine } from "../../models/customerOrders/insertCustomerOrderLine.js";
import { insertCustomerOrderLineAttribute } from "../../models/customerOrders/insertCustomerOrderLineAttribute.js";
import { voidTransaction } from "../pos/voidTransaction.js";

export const createCustomerOrder = async (createdBy) => {
  const connection = await getConnection();
  const WAREHOUSE_ID = 1; // YARD

  try {
    await connection.beginTransaction();

    // Fetch data and deconstruct
    const { transactionHeader, transactionLines } = await fetchPosPage2(
      createdBy
    );

    if (!transactionHeader || !transactionLines) {
      throw new AppError(
        500,
        "Failed to fetch citical information.",
        "Operation failed."
      );
    }

    const { client, details, payment, totals } = transactionHeader;
    const { clientId } = client;
    const { transactionTypeId, requiredDate, isQuote, orderExtra } = details;
    const { taxRegion, paymentMethodId, paymentAmountAsDecimal } = payment;

    if (client.clientId === null) {
      throw new AppError(
        400,
        "Cannot create orders without customers.",
        "Invalid order configuration."
      );
    }

    if (totals.subtotalAsDecimal <= 0) {
      throw new AppError(
        400,
        "Cannot create orders without products.",
        "Invalid order configuration."
      );
    }

    if (isQuote && payment.paymentAmountAsDecimal > 0) {
      throw new AppError(
        400,
        `Quotes cannot hold payments. Remove "quote" flag or payment amount.`,
        "Invalid order configuration."
      );
    }

    // Insert and retrieve orderNo
    const orderNo = await insertCustomerOrder(
      connection,
      clientId,
      requiredDate,
      isQuote,
      taxRegion,
      orderExtra,
      createdBy
    );

    // Insert and retrieve transactionId if not a quote
    let transactionId = null;
    if (!isQuote) {
      transactionId = await insertTransaction(
        connection,
        orderNo,
        transactionTypeId,
        createdBy
      );

      // Insert payment entry if payment
      if (paymentAmountAsDecimal > 0) {
        await insertPaymentEntry(
          connection,
          transactionId,
          orderNo,
          clientId,
          paymentAmountAsDecimal,
          paymentMethodId
        );
      }
    }

    // Insert orders list (items)
    for (const line of transactionLines) {
      const {
        item,
        lineNo,
        item: { quantity, itemNo, attributes },
        pricing: { unitPriceAsDecimal, lineDiscountPercentageAsDecimal },
      } = line;

      await insertCustomerOrderLine(
        connection,
        orderNo,
        lineNo,
        WAREHOUSE_ID,
        itemNo,
        quantity,
        lineDiscountPercentageAsDecimal,
        unitPriceAsDecimal
      );

      for (const attr of attributes.attributes) {
        // Insert orders list lines attributes
        await insertCustomerOrderLineAttribute(
          connection,
          orderNo,
          lineNo,
          attr.attrId
        );
      }
    }

    // Void transaction (clear)
    await voidTransaction(createdBy);

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
