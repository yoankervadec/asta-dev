//
// server/back-end/services/pos/voidTransaction.js

import { fetchUserDetails } from "../helper/fetchUserDetails.js";

import { deleteTransaction } from "../../models/pos/deleteTransaction.js";

export const voidTransaction = async (createdBy) => {
  const userDetails = await fetchUserDetails(createdBy);
  const taxRegion = userDetails.region;
  // Logic for voiding a transaction
  await deleteTransaction(createdBy, taxRegion);
};
