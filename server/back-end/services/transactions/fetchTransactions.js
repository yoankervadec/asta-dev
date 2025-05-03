//
// server/back-end/services/transactions/fetchTransactions.js

import { selectTransactions } from "../../models/transactions/selectTransactions.js";

import { formatDate } from "../../utils/dates/dateHelper.js";
import { isValidNumberOrNull } from "../../utils/typeCheck/typeCheck.js";
import { AppError } from "../../utils/errorHandling/AppError.js";

export const fetchTransactions = async (
  transactionId = null,
  orderNo = null,
  clientId = null,
  transactionType = null
) => {
  try {
    if (!isValidNumberOrNull(transactionId)) {
      throw new AppError(
        400,
        "Invalid Parameters.",
        `Invalid Transaction ID: ${transactionId}.`
      );
    }
    if (!isValidNumberOrNull(orderNo)) {
      throw new AppError(
        400,
        "Invalid Parameters.",
        `Invalid Order No.: ${orderNo}.`
      );
    }
    if (!isValidNumberOrNull(clientId)) {
      throw new AppError(
        400,
        "Invalid Parameters.",
        `Invalid Client ID: ${clientId}.`
      );
    }
    if (!isValidNumberOrNull(transactionType)) {
      throw new AppError(
        400,
        "Invalid Parameters.",
        `Invalid Transaction Type: ${transactionType}.`
      );
    }

    const lines = await selectTransactions(
      transactionId,
      orderNo,
      clientId,
      transactionType
    );

    const result = lines.map((line) => {
      return {
        transactionId: line.transaction_id,
        orderNo: line.order_no,
        totals: {
          transactionTypeId: line.type,
          transactionTypeName: line.type_as_name,
          amountAsDecimal: parseFloat(line.amount),
          amountToString: parseFloat(line.amount).toLocaleString(undefined, {
            minimumFractionDigits: 2,
          }),
          paymentAmountAsDecimal: parseFloat(line.payment_amount),
          paymentAmountToString: parseFloat(line.payment_amount).toLocaleString(
            undefined,
            { minimumFractionDigits: 2 }
          ),
        },
        details: {
          createdAt: formatDate(line.created_at),
          createdById: line.created_by,
          createdByName: line.created_by_name,
        },
      };
    });

    return result;
  } catch (error) {
    throw error;
  }
};
