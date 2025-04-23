//
// server/back-end/services/pdf/utils/generatePdfBuffer.js

import ejs from "ejs";
import puppeteer from "puppeteer";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const generatePdfBuffer = async (templateName, data) => {
  const templatePath = path.join(
    __dirname,
    "../templates",
    `${templateName}.ejs`
  );
  const cssPath = path.join(__dirname, "../templates/styles/styles.css");

  const [htmlTemplate, cssContent] = await Promise.all([
    fs.readFile(templatePath, "utf-8"),
    fs.readFile(cssPath, "utf-8"),
  ]);

  const html = await ejs.render(
    htmlTemplate,
    { ...data, styles: `<style>${cssContent}</style>` },
    {
      async: true,
      filename: templatePath, // ensures EJS can resolve relative includes
    }
  );

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({ format: "A4" });

  await browser.close();
  return Buffer.from(pdfBuffer);
};
