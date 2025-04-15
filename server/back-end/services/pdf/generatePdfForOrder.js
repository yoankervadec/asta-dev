//
// server/back-end/services/pdf/generatePdfForOrder.js

import fs from "fs";

import { fillHtmlTemplate } from "./utils/fillHtmlTemplate.js";
import { generatePdfFromHtml } from "./utils/generatePdfFromHtml.js";

import { fetchViewOrderCard } from "../customerOrders/fetchViewOrderCard.js";

export const generatePdfForOrder = async ({ orderNo }) => {
  try {
    const templatePath = new URL(
      "../../templates/template.html",
      import.meta.url
    );

    const co = await fetchViewOrderCard(orderNo);
    const { orderHeader, orderLines, paymentEntries } = co;

    const logoBase64 = fs.readFileSync(
      "/home/spserver/asta/server/back-end/templates/img/Logo_LeTourneur.png",
      { encoding: "base64" }
    );
    const logoDataUrl = `data:image/png;base64,${logoBase64}`;

    // Fill the template with dynamic data
    const placeholders = {
      type: orderHeader.meta.status,
      orderNo: orderHeader.meta.orderNo,
      logoDataUrl,
      type: orderHeader.meta.status,
      orderNo: orderHeader.meta.orderNo,
      createdAt: orderHeader.orderInfo.createdAt,
      clientName: orderHeader.customer.name,
      clientAddress: `${orderHeader.customer.location.address} ${orderHeader.customer.location.city} ${orderHeader.customer.location.postalCode}`,
      clientPhone: orderHeader.customer.contact.phone,
      clientEmail: orderHeader.customer.contact.email,
      itemsList: orderLines
        .filter((line) => line.lineStatus !== "Canceled") // Exclude canceled lines, will replace for statusCode
        .map(
          (line) => `
        <tr>
          <td>${line.item.itemNo}</td>
          <td>${line.item.description}</td>
          <td>${line.item.quantity}</td>
          <td>${line.pricing.unitPrice}</td>
          <td>${line.pricing.lineTotal}</td>
        </tr>
      `
        )
        .join(""),
      extra: orderHeader.orderInfo.extra,
      subtotal: orderHeader.totals.subtotal,
      pstAmount: orderHeader.totals.pst,
      gstAmount: orderHeader.totals.gst,
      total: orderHeader.totals.total,
      paymentAmount: orderHeader.totals.paymentAmount,
      balance: orderHeader.totals.balance,
    };

    const filledHtml = await fillHtmlTemplate(templatePath, placeholders);

    // Generate PDF from the filled HTML
    return await generatePdfFromHtml(filledHtml);
  } catch (error) {
    throw new Error(`Error in PDF service: ${error.message}`);
  }
};
