//
// server/back-end/services/invoices/fetchMapInvoiceHeaders.js

import { viewInvoiceHeaders } from "../../models/invoices/viewInvoiceHeaders.js";
import { viewInvoiceLines } from "../../models/invoices/viewInvoiceLines.js";
import { fetchPaymentEntries } from "../paymentEntries/fetchPaymentEntries.js";

import { isValidNumberOrNull } from "../../utils/typeCheck/typeCheck.js";
import { AppError } from "../../utils/errorHandling/AppError.js";

export const fetchMapInvoiceHeaders = async (
  invoiceNo = null,
  orderNo = null,
  clientId = null
) => {
  try {
    if (
      !isValidNumberOrNull(orderNo) ||
      !isValidNumberOrNull(clientId) ||
      !isValidNumberOrNull(invoiceNo)
    ) {
      throw new AppError(
        400,
        `Failed to fetch Invoice Headers: Invalid parameters.`
      );
    }

    const [invoiceHeaders, invoiceLines, paymentLines] = await Promise.all([
      viewInvoiceHeaders(invoiceNo, orderNo, clientId),
      viewInvoiceLines(invoiceNo, orderNo),
      fetchPaymentEntries(null, orderNo, clientId),
    ]);

    if (invoiceHeaders.length === 0) return;

    // To be continued...
  } catch (error) {
    throw error;
  }
};
