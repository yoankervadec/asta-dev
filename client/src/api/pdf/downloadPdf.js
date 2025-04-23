//
// client/src/api/pdf/downloadPdf.js

import fetchPdfBlob from "./fetchPdfBlob";

export const downloadPdf = async (url, id, documentType) => {
  try {
    const blob = await fetchPdfBlob(url, id, documentType);
    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = `${documentType || "document"}-${id}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(link.href), 60000);
  } catch (err) {
    console.error("Failed to download PDF:", err);
    alert("An error occurred while downloading the PDF.");
  }
};
