//
// server/back-end/services/paymentEntries/fetchViewPaymentEntries.js

import { selectViewPaymentEntries } from "../../models/paymentEntries/selectViewPaymentEntries.js";

import { isValidNumberOrNull } from "../../utils/typeCheck/typeCheck.js";
import { formatDate } from "../../utils/dates/dateHelper.js";

export const fetchViewPaymentEntries = async (
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

    const result = await selectViewPaymentEntries(
      transactionId,
      orderNo,
      clientId
    );

    const lines = result.map((line) => {
      return {
        entryNo: line.entry_no,
        details: {
          transactionId: line.transaction_id,
          transactionType: line.transaction_type,
          orderNo: line.order_no,
          createdAt: formatDate(line.date),
          createdBy: line.created_by,
          payment: {
            paymentMethod: line.payment_method,
            paymentAmount: line.payment_amount,
          },
        },
        customer: {
          clientId: line.client_id,
          clientName: line.name,
          phone: line.phone,
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
