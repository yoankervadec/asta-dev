//
// client/src/api/postHelper.js

import { useMutation } from "@tanstack/react-query";
import { apiHelper } from "./apiHelper";

export function usePostHelper(endpoint, options = {}, navigate = null) {
  return useMutation({
    mutationFn: async (body) => {
      return apiHelper(endpoint, { method: "POST", body }, navigate);
    },
    ...options, // Allow customization (onSuccess, onError)
  });
}
