//
// server/back-end/controllers/pdf.controllers.js

import { generateOrderPdf } from "../services/pdf/generateOrderPdf.js";
import { generateInvoicePdf } from "../services/pdf/generateInvoicePdf.js";
import { generateProductionListPdf } from "../services/pdf/generateProductionListPdf.js";

export const handleGenerateOrderPdf = async (req, res) => {
  const { id } = req.body;
  try {
    const pdfBuffer = await generateOrderPdf(parseFloat(id));

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename=order-${id}.pdf`,
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error("Error generating order PDF:", err);
    res.status(500).send("Failed to generate PDF");
  }
};

export const handleGenerateInvoicePdf = async (req, res) => {
  const { id } = req.body;
  try {
    const pdfBuffer = await generateInvoicePdf(parseFloat(id));

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename=invoice-${id}.pdf`,
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error("Error generating invoice PDF:", err);
    res.status(500).send("Failed to generate PDF");
  }
};

export const handleGenerateProductionListPdf = async (req, res) => {
  const { dateGroupRangeDays } = req.body;

  try {
    const pdfBuffer = await generateProductionListPdf(dateGroupRangeDays);
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename=production-list.pdf`,
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error("Error generating Production List PDF:", err);
    res.status(500).send("Failed to generate PDF");
  }
};
