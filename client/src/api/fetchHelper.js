//
// client/src/api/fetchHelper.js

import { apiHelper } from "./apiHelper";

export const fetchHelper = async (endpoint, navigate = null, params = null) => {
  const cleanedParams = Object.fromEntries(
    Object.entries(params || {}).filter(([_, v]) => v !== "")
  );

  const result = await apiHelper(endpoint, { ...cleanedParams }, navigate); // Spread params directly
  return result || {};
};
