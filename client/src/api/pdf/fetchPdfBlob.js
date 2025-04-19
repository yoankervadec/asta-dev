//
// client/src/api/pdf/fetchPdfBlob.js

import axios from "axios";

const fetchPdfBlob = async (url, id) => {
  const response = await axios.post(
    `/api/${url}`,
    { id },
    {
      responseType: "blob",
      headers: { "Content-Type": "application/json" },
    }
  );

  const contentType = response.headers["content-type"];
  if (contentType !== "application/pdf") {
    // Convert blob to text to read error
    const text = await response.data.text?.();
    throw new Error(`Unexpected content type: ${contentType}, ${text}`);
  }

  return new Blob([response.data], { type: "application/pdf" });
};

export default fetchPdfBlob;
