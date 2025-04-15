//
// server/back-end/services/pos2/fetchPosPage.js

import { AppError } from "../../utils/errorHandling/AppError.js";

import { format } from "date-fns";

import { selectTransactionHeader } from "../../models/pos2/selectTransactionHeader.js";
import { selectTransactionLines } from "../../models/pos2/selectTransactionLines.js";

import { returnLineDiscount } from "../../utils/financial/returnLineDiscount.js";
import { returnLineAmount } from "../../utils/financial/returnLineAmount.js";
import { returnTaxAmount } from "../../utils/financial/returnTaxAmount.js";
import { returnBoardfeet } from "../../utils/financial/returnBoardfeet.js";
import { roundToTwoDecimals } from "../../utils/financial/roundToTwoDecimals.js";

import { formatDate } from "../../utils/dates/dateHelper.js";

import { isValidNumberOrNull } from "../../utils/typeCheck/typeCheck.js";

export const fetchPosPage2 = async (createdBy) => {
  const parsedUserId = parseFloat(createdBy);
  try {
    if (!isValidNumberOrNull(parsedUserId)) {
      throw new AppError(
        400,
        "Invalid UserId.",
        "Invalid UserId, contact Yoan."
      );
    }

    const rawHeader = await selectTransactionHeader(parsedUserId);
    const rawLines = await selectTransactionLines(parsedUserId);
    // Extract tax rate
    const pstRate = parseFloat(rawHeader?.pst) || 0;
    const gstRate = parseFloat(rawHeader?.gst) || 0;

    // Map over lines
    const lines = rawLines.map((line) => {
      const lineDateCreated = formatDate(line.created_at);

      const lineBoardfeet =
        returnBoardfeet(line.thickness, line.width, line.length) *
        line.quantity;

      const lineDiscount = roundToTwoDecimals(
        returnLineDiscount(line.quantity, line.unit_price, line.disc_perc)
      );
      const lineSubtotal = roundToTwoDecimals(
        returnLineAmount(line.quantity, line.unit_price, line.disc_perc)
      );
      const linePst = roundToTwoDecimals(
        returnTaxAmount(lineSubtotal, pstRate)
      );
      const lineGst = roundToTwoDecimals(
        returnTaxAmount(lineSubtotal, gstRate)
      );
      const lineTotal = roundToTwoDecimals(lineSubtotal + linePst + lineGst);

      // Construct and return "line" object
      return {
        lineNo: line.line_no,
        item: {
          quantity: parseFloat(line.quantity),
          itemNo: line.item_no,
          description: line.description,
          lineBoardfeetAsDecimal: lineBoardfeet,
          lineBoardfeetToString: lineBoardfeet.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          }),
          attributes: {
            attributeIdSetAsString: line.attr_id_set_as_string,
            attributeNameSetAsString: line.attr_name_set_as_string,
            attributes: line.attr_as_array,
          },
        },
        pricing: {
          unitPriceAsDecimal: parseFloat(line.unit_price),
          unitPriceToString: line.unit_price,
          lineDiscountPercentageAsDecimal: parseFloat(line.disc_perc),
          lineDiscountPercentageToString: line.disc_perc,
          lineDiscountAmountAsDecimal: lineDiscount,
          lineDiscountAmountToString: lineDiscount.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          }),
          lineSubtotalAsDecimal: lineSubtotal,
          lineSubtotalToString: lineSubtotal.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          }),
          linePstAsDecimal: linePst,
          linePstToString: linePst.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          }),
          lineGstAsDecimal: lineGst,
          lineGstToString: lineGst.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          }),
          lineTotalAsDecimal: lineTotal,
          lineTotalToString: lineTotal.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          }),
        },
        details: {
          createdById: line.created_by,
          createdByName: line.created_by_name,
          createdAt: lineDateCreated,
        },
      };
    });
    // console.log(JSON.stringify(lines, null, 2));

    // Header
    const headerTotals = lines.reduce(
      (acc, line) => {
        acc.boardfeet += line.item.lineBoardfeetAsDecimal;
        acc.subtotal += line.pricing.lineSubtotalAsDecimal;
        acc.discount += line.pricing.lineDiscountAmountAsDecimal;
        acc.pst += line.pricing.linePstAsDecimal;
        acc.gst += line.pricing.lineGstAsDecimal;
        acc.total += line.pricing.lineTotalAsDecimal;
        return acc;
      },
      {
        boardfeet: 0,
        subtotal: 0,
        discount: 0,
        pst: 0,
        gst: 0,
        total: 0,
      }
    );
    // Round headerTotals to two decimals
    Object.keys(headerTotals).forEach((key) => {
      headerTotals[key] = roundToTwoDecimals(headerTotals[key]);
    });

    const headerDateCreated = formatDate(rawHeader?.created_at);
    const headerRequiredDate = format(
      new Date(rawHeader?.required_date),
      "yyyy-MM-dd"
    );

    const totalTax = roundToTwoDecimals(headerTotals.pst + headerTotals.gst);

    // Construct and return "header" object
    const header = {
      client: {
        clientId: rawHeader.client_id,
        clientName: rawHeader.name,
        clientName2: rawHeader.name2,
        contact: {
          phone: rawHeader.phone,
          phone2: rawHeader.phone2,
          email: rawHeader.email,
        },
        location: {
          address: rawHeader.address,
          city: rawHeader.city,
          postalCode: rawHeader.postal_code,
        },
        details: {
          clientExtra: rawHeader.client_extra,
        },
      },
      details: {
        totalBoardfeetAsDecimal: headerTotals.boardfeet,
        totalBoardfeetToString: headerTotals.boardfeet.toLocaleString(
          undefined,
          { minimumFractionDigits: 2 }
        ),
        transactionTypeId: rawHeader.transaction_type,
        transactionType: rawHeader.transaction_type_name,
        requiredDate: headerRequiredDate,
        isQuote: !!rawHeader.quote,
        orderExtra: rawHeader.extra,
        createdById: rawHeader.created_by,
        createdByName: rawHeader.created_by_name,
        createdByNameShort: rawHeader.created_by_name_short,
        createdAt: headerDateCreated,
      },
      payment: {
        taxRegion: rawHeader.tax_region,
        pstRateAsDecimal: pstRate,
        pstRateToString: pstRate.toLocaleString(undefined, {
          minimumFractionDigits: 2,
        }),
        gstRateAsDecimal: gstRate,
        gstRateToString: gstRate.toLocaleString(undefined, {
          minimumFractionDigits: 2,
        }),
        paymentMethodId: rawHeader.payment_method,
        paymentMethodName: rawHeader.payment_method_name,
        paymentAmountAsDecimal: parseFloat(rawHeader.payment_amount),
        paymentAmountToString: parseFloat(
          rawHeader.payment_amount
        ).toLocaleString(undefined, { minimumFractionDigits: 2 }),
      },
      totals: {
        subtotalAsDecimal: headerTotals.subtotal,
        subtotalToString: headerTotals.subtotal.toLocaleString(undefined, {
          minimumFractionDigits: 2,
        }),
        discountAmountAsDecimal: headerTotals.discount,
        discountAmountToString: headerTotals.discount.toLocaleString(
          undefined,
          { minimumFractionDigits: 2 }
        ),
        pstAmountAsDecimal: headerTotals.pst,
        pstAmountToString: headerTotals.pst.toLocaleString(undefined, {
          minimumFractionDigits: 2,
        }),
        gstAmountAsDecimal: headerTotals.gst,
        gstAmountToString: headerTotals.gst.toLocaleString(undefined, {
          minimumFractionDigits: 2,
        }),
        taxTotalAsDecimal: totalTax,
        taxTotalToString: totalTax.toLocaleString(undefined, {
          minimumFractionDigits: 2,
        }),
        totalAmountAsDecimal: headerTotals.total,
        totalAmountToString: headerTotals.total.toLocaleString(undefined, {
          minimumFractionDigits: 2,
        }),
      },
    };
    // console.log(JSON.stringify(header, null, 2));

    return {
      transactionHeader: header,
      transactionLines: lines,
    };
  } catch (error) {
    throw error;
  }
};
