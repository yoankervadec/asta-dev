//
// server/back-end/services/pdf/utils/generatePdfFromHtml.js

import { getWebSocketDebuggerUrl } from "./getWebSocketDebuggerUrl.js";
import puppeteer from "puppeteer";

export const generatePdfFromHtml = async (htmlContent) => {
  try {
    const browserWsUrl = await getWebSocketDebuggerUrl();
    const browser = await puppeteer.connect({
      browserWSEndpoint: browserWsUrl,
    });
    const page = await browser.newPage();

    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await page.close();
    await browser.disconnect();

    return pdfBuffer;
  } catch (error) {
    throw new Error(`Failed to generate PDF: ${error.message}`);
  }
};
