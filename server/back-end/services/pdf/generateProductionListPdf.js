//
// server/back-end/services/pdf/generateProductionListPdf.js

import { fetchProductionList } from "../production/fetchProductionList.js";
import { generatePdfBuffer } from "./utils/generatePdfBuffer.js";

export const generateProductionListPdf = async (dateGroupRangeDays = 7) => {
  const data = await fetchProductionList(dateGroupRangeDays);

  return await generatePdfBuffer("production-list", { data });
};
