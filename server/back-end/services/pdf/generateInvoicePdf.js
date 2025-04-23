//
// server/back-end/services/pdf/generateInvoicePdf.js

import { fetchMapInvoiceHeaders } from "../invoices/fetchMapInvoiceHeaders.js";
import { generatePdfBuffer } from "./utils/generatePdfBuffer.js";

export const generateInvoicePdf = async (invoiceNo) => {
  const invoice = await fetchMapInvoiceHeaders(invoiceNo);

  const {
    customer,
    details: info,
    totals,
    invoiceLines: lines,
    paymentEntries: paymentLines,
  } = invoice[0];

  return await generatePdfBuffer("invoice", {
    customer,
    info,
    totals,
    lines,
    paymentLines,
  });
};
