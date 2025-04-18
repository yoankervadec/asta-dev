//
// client/src/api/fetchHelper.js

import { apiHelper } from "./apiHelper";

export const fetchHelper = async (endpoint, navigate = null, params = null) => {
  const cleanedParams = {
    ...params,
    params: Object.fromEntries(
      Object.entries(params?.params || {}).filter(([_, v]) => v !== "")
    ),
  };

  const result = await apiHelper(endpoint, cleanedParams, navigate);
  return result || {};
};
