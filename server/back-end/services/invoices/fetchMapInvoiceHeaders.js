//
// server/back-end/services/invoices/fetchMapInvoiceHeaders.js

import { viewInvoiceHeaders } from "../../models/invoices/viewInvoiceHeaders.js";
import { viewInvoiceLines } from "../../models/invoices/viewInvoiceLines.js";
import { fetchPaymentEntries } from "../paymentEntries/fetchPaymentEntries.js";

import { format } from "date-fns";
import { isValidNumberOrNull } from "../../utils/typeCheck/typeCheck.js";
import { roundToTwoDecimals } from "../../utils/financial/roundToTwoDecimals.js";
import { returnLineDiscount } from "../../utils/financial/returnLineDiscount.js";
import { returnLineAmount } from "../../utils/financial/returnLineAmount.js";
import { returnTaxAmount } from "../../utils/financial/returnTaxAmount.js";
import { formatDate } from "../../utils/dates/dateHelper.js";
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

    if (invoiceHeaders.length === 0) return [];

    // Organize lines and payments into maps
    const invoiceLinesMap = new Map();
    const paymentEntriesMap = new Map();

    invoiceLines.forEach((line) => {
      if (!invoiceLinesMap.has(line.invoice_no)) {
        invoiceLinesMap.set(line.invoice_no, []);
      }

      // Calculate total for each invoice lines
      const pstRate = parseFloat(line.pst);
      const gstRate = parseFloat(line.gst);

      // Calculate and round line discount
      const lineDiscountAsDecimal = roundToTwoDecimals(
        returnLineDiscount(line.quantity, line.unit_price, line.discount)
      );

      // Calculate and round line subtotal
      const lineSubtotalAsDecimal = roundToTwoDecimals(
        returnLineAmount(line.quantity, line.unit_price, line.discount)
      );

      // Calc line PST
      const linePstAsDecimal = roundToTwoDecimals(
        returnTaxAmount(lineSubtotalAsDecimal, pstRate)
      );
      // Calc line GST
      const lineGstAsDecimal = roundToTwoDecimals(
        returnTaxAmount(lineSubtotalAsDecimal, gstRate)
      );

      // Sum sub, pst and gst for total
      const lineTotalAsDecimal =
        lineSubtotalAsDecimal + linePstAsDecimal + lineGstAsDecimal;

      const formattedLine = {
        invoiceNo: line.invoice_no,
        orderNo: line.order_no,
        lineNo: line.line_no,
        customer: {
          clientId: line.client_id,
          clientName: line.name,
          phone: line.phone,
        },
        item: {
          itemNo: line.item_no,
          description: line.description,
          quantity: line.quantity,
          attributes: {
            attributeIdSetAsString: line.attr_id_set_as_string,
            attributeNameSetAsString: line.attr_name_set_as_string,
            attributes: line.attr_as_array || "[]",
          },
        },
        pricing: {
          unitPriceAsDecimal: parseFloat(line.unit_price),
          unitPriceToString: line.unit_price.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          }),
          lineDiscountAsDecimal,
          lineDiscountAmountToString: lineDiscountAsDecimal.toLocaleString(
            undefined,
            {
              minimumFractionDigits: 2,
            }
          ),
          lineSubtotalAsDecimal,
          lineSubtotalToString: lineSubtotalAsDecimal.toLocaleString(
            undefined,
            {
              minimumFractionDigits: 2,
            }
          ),
          lineGstAsDecimal,
          lineGstToString: lineGstAsDecimal.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          }),
          linePstAsDecimal,
          linePstToString: linePstAsDecimal.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          }),
          lineTotalAsDecimal,
          lineTotalToString: lineTotalAsDecimal.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          }),
          lineDiscountPercentage: line.discount,
        },
        details: {
          createdAt: formatDate(line.created_at),
          createdByName: line.created_by,
        },
      };

      invoiceLinesMap.get(line.invoice_no).push(formattedLine);
    });

    paymentLines.forEach((entry) => {
      if (!paymentEntriesMap.has(entry.orderNo)) {
        paymentEntriesMap.set(entry.orderNo, []);
      }

      paymentEntriesMap.get(entry.orderNo).push(entry);
    });

    // Format and merge invoices
    const groupedInvoices = invoiceHeaders.map((header) => {
      const invoiceNo = header.invoice_no;
      const orderNo = header.order_no;

      // Get invoice totals
      const invoiceLinesForHeader = invoiceLinesMap.get(invoiceNo) || [];

      const rawTotals = invoiceLinesForHeader.reduce(
        (acc, line) => {
          acc.subtotalAsDecimal += line.pricing.lineSubtotalAsDecimal;
          acc.discountAsDecimal += line.pricing.lineDiscountAsDecimal;
          acc.totalAsDecimal += line.pricing.lineTotalAsDecimal;
          return acc;
        },
        {
          subtotalAsDecimal: 0,
          discountAsDecimal: 0,
          totalAsDecimal: 0,
        }
      );

      const paymentAmountAsDecimal = (
        paymentEntriesMap.get(orderNo) || []
      ).reduce((acc, entry) => acc + entry.details.amount, 0);

      // PST and GST can be calculated if needed individually as well (just like total)

      const totals = {
        subtotalAsDecimal: roundToTwoDecimals(rawTotals.subtotalAsDecimal),
        subtotalToString: roundToTwoDecimals(
          rawTotals.subtotalAsDecimal
        ).toLocaleString(undefined, { minimumFractionDigits: 2 }),

        discountAsDecimal: roundToTwoDecimals(rawTotals.discountAsDecimal),
        discountToString: roundToTwoDecimals(
          rawTotals.discountAsDecimal
        ).toLocaleString(undefined, { minimumFractionDigits: 2 }),

        totalAsDecimal: roundToTwoDecimals(rawTotals.totalAsDecimal),
        totalToString: roundToTwoDecimals(
          rawTotals.totalAsDecimal
        ).toLocaleString(undefined, { minimumFractionDigits: 2 }),

        paymentAmountAsDecimal: roundToTwoDecimals(paymentAmountAsDecimal),
        paymentAmountToString: roundToTwoDecimals(
          paymentAmountAsDecimal
        ).toLocaleString(undefined, { minimumFractionDigits: 2 }),

        balanceAsDecimal: roundToTwoDecimals(
          rawTotals.totalAsDecimal - paymentAmountAsDecimal
        ),
        balanceToString: roundToTwoDecimals(
          rawTotals.totalAsDecimal - paymentAmountAsDecimal
        ).toLocaleString(undefined, { minimumFractionDigits: 2 }),
      };

      const formattedHeader = {
        invoiceNo,
        orderNo,
        customer: {
          clientId: header.client_id,
          name: header.name,
          name2: header.name2,
          contact: {
            phone: header.phone,
            phone2: header.phone2,
            email: header.email,
          },
          location: {
            address: header.address,
            city: header.city,
            postalCode: header.postal_code,
          },
          extra: header.client_extra,
        },
        order: {
          requiredDate: format(new Date(header.required_date), "yyyy-MM-dd"),
          taxRegion: header.tax_region,
          extra: header.order_extra,
        },
        details: {
          createdAt: formatDate(header.invoice_created_at),
          createdBy: header.invoice_created_by_name,
        },
        invoiceLines: invoiceLinesMap.get(invoiceNo) || [],
        paymentEntries: paymentEntriesMap.get(orderNo) || [],
        totals,
      };

      return formattedHeader;
    });

    // console.log(JSON.stringify(groupedInvoices, null, 2));
    return groupedInvoices;
  } catch (error) {
    throw error;
  }
};
