//
// server/back-end/services/clients/alterClientTransactionHeader.js

import { updateClientTransactionHeader } from "../../models/clients/updateClientTransactionHeader.js";

export const alterClientTransactionHeader = async (clientId, createdBy) => {
  if (!clientId) {
    throw new Error("Invalid Client ID");
  }

  await updateClientTransactionHeader(clientId, createdBy);
};
