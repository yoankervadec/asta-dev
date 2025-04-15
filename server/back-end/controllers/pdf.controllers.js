//
// server/back-end/controllers/pdf.controllers.js

import { fetchCoCard } from "../services/co/fetchCoCard.js";
import fs from "fs";
import puppeteer from "puppeteer";
import axios from "axios"; // To fetch the WebSocket URL dynamically
import { generatePdfForOrder } from "../services/pdf/generatePdfForOrder.js";

// Function to get the WebSocket debugger URL dynamically
const getWebSocketDebuggerUrl = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:9222/json/version");
    const browserWsUrl = response.data.webSocketDebuggerUrl; // Extract the WebSocket URL
    if (!browserWsUrl) {
      throw new Error("No WebSocket URL found");
    }
    return browserWsUrl;
  } catch (error) {
    throw new Error(`Failed to fetch WebSocket URL: ${error.message}`);
  }
};

export const generatePDFController = async (req, res) => {
  const { orderNo } = req.body;

  if (!orderNo) {
    return res.status(400).send("Order number is required");
  }

  try {
    const browserWsUrl = await getWebSocketDebuggerUrl(); // Get the dynamic WebSocket URL
    const browser = await puppeteer.connect({
      browserWSEndpoint: browserWsUrl,
    });
    const page = await browser.newPage();

    // Fetch the order data
    const orderData = await fetchCoCard(orderNo);

    console.log(
      `Printing order: ${orderNo} for ${orderData.customerInformation.name}...`
    );

    // Load the HTML template
    const templatePath = new URL("../templates/template.html", import.meta.url);
    const htmlContent = await fs.promises.readFile(templatePath, "utf8");

    // Replace placeholders in the template with actual order data
    const filledHtml = htmlContent
      .replace("{{orderNo}}", orderData.orderMetaData.order_no)
      .replace("{{date}}", orderData.orderInformation.required_date)
      .replace("{{customerName}}", orderData.customerInformation.name)
      .replace("{{customerPhone}}", orderData.customerInformation.phone)
      .replace("{{customerEmail}}", orderData.customerInformation.email)
      .replace("{{customerAddress}}", orderData.customerInformation.address)
      .replace("{{customerCity}}", orderData.customerInformation.city)
      .replace(
        "{{customerPostalCode}}",
        orderData.customerInformation.postal_code
      )
      .replace(
        "{{itemsList}}",
        orderData.itemsList
          .map(
            (item) => `
          <tr>
            <td>${item.description}</td>
            <td>${item.quantity}</td>
            <td>$${item.unit_price}</td>
            <td>$${item.lineDiscount}</td>
            <td>$${item.lineAmount}</td>
          </tr>
        `
          )
          .join("")
      )
      .replace("{{subtotal}}", orderData.orderInformation.subtotal)
      .replace("{{taxAmount}}", orderData.orderInformation.taxAmount)
      .replace("{{totalWithTax}}", orderData.orderInformation.totalWithTax)
      .replace("{{paymentAmount}}", orderData.orderInformation.paymentAmount)
      .replace("{{balance}}", orderData.orderInformation.balance);

    // Set the content for the page
    await page.setContent(filledHtml, { waitUntil: "networkidle0" });

    // Generate PDF from the page
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await page.close();

    // Send the PDF buffer as a response
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="Order-${orderNo}.pdf"`,
    });

    res.end(pdfBuffer);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Failed to generate PDF");
  }
};


export const handleGeneratePdfForOrder = async (req, res) => {
  const { orderNo } = req.body;

  if (!orderNo) {
    return res.status(400).send("Order number is required");
  }

  try {
    console.log(`Generating PDF for order: ${orderNo}`);
    const pdfBuffer = await generatePdfForOrder({ orderNo });

    // Send the PDF as a response
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="Order-${orderNo}.pdf"`,
    });
    res.end(pdfBuffer);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Failed to generate PDF");
  }
};