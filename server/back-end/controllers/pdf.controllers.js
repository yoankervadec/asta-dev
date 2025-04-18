//
// server/back-end/controllers/pdf.controllers.js

import { generateOrderPdf } from "../services/pdf/generateOrderPdf.js";

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
    console.error("Error generating invoice PDF:", err);
    res.status(500).send("Failed to generate PDF");
  }
};
