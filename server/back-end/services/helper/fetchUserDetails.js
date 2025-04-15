// 
// server/back-end/services/helper/fetchUserDetails.js

import { selectUserDetails } from "../../models/auth/selectUserDetails.js";

export const fetchUserDetails = async (userId) => {
  const userDetails = await selectUserDetails(userId);

  return userDetails;
};