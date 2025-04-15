//
// server/back-end/services/pdf/utils/fillHtmlTemplate.js

import fs from "fs"

export const fillHtmlTemplate = async (templatePath, placeholders) => {
  try {
    const htmlContent = await fs.promises.readFile(templatePath, "utf8");
    return Object.keys(placeholders).reduce(
      (content, key) =>
        content.replace(new RegExp(`{{${key}}}`, "g"), placeholders[key]),
      htmlContent
    );
  } catch (error) {
    throw new Error(`Failed to load or fill template: ${error.message}`);
  }
};
