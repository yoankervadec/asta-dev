//
// client/src/api/pdf/viewPdf.js

import fetchPdfBlob from "./fetchPdfBlob";

export const viewPdf = async (url, id) => {
  try {
    const blob = await fetchPdfBlob(url, id);
    const blobURL = URL.createObjectURL(blob);

    const newTab = window.open();
    if (newTab) {
      newTab.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Order #${id}</title>
            <style>
              html, body { margin: 0; height: 100%; overflow: hidden; }
              iframe { width: 100%; height: 100%; border: none; }
            </style>
          </head>
          <body>
            <iframe src="${blobURL}"></iframe>
          </body>
        </html>
      `);
      newTab.document.close();
    } else {
      alert("Pop-up blocked. Please allow pop-ups for this site.");
    }

    setTimeout(() => URL.revokeObjectURL(blobURL), 60000);
  } catch (err) {
    console.error("Failed to view PDF:", err);
    alert("An error occurred while viewing the PDF.");
  }
};
