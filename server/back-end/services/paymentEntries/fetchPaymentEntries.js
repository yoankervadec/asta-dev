//
// server/back-end/services/paymentEntries/fetchPaymentEntries.js

import { selectPaymentEntries } from "../../models/paymentEntries/selectPaymentEntries.js";
import { formatDate } from "../../utils/dates/dateHelper.js";

import { isValidNumberOrNull } from "../../utils/typeCheck/typeCheck.js";

export const fetchPaymentEntries = async (
  transactionId = null,
  orderNo = null,
  clientId = null
) => {
  try {
    if (
      !isValidNumberOrNull(transactionId) ||
      !isValidNumberOrNull(orderNo) ||
      !isValidNumberOrNull(clientId)
    ) {
      throw {
        status: 400,
        message: `Failed to fetch order lines: Invalid parameter.`,
        title: "Contact Yoan.",
      };
    }

    const result = await selectPaymentEntries(transactionId, orderNo, clientId);

    const lines = result.map((line) => {
      return {
        entryNo: line.entry_no,
        orderNo: line.order_no,
        details: {
          transactionId: line.transaction_id,
          orderNo: line.order_no,
          clientId: line.client_id,
          date: formatDate(line.date),
          method: line.payment_method,
          amount: parseFloat(line.payment_amount),
        },
      };
    });

    // console.log(JSON.stringify(lines, null, 2));
    return lines;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
