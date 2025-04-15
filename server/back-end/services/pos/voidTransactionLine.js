//
// server/back-end/services/pos/voidTransactionLine.js

import { deleteTransactionLine } from "../../models/pos/deleteTransactionLine.js";

export const voidTransactionLine = async (createdBy, lineNo) => {
  // Logic for voiding a specific line
  await deleteTransactionLine(createdBy, lineNo);
};
