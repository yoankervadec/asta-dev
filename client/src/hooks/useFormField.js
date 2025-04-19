//
// client/src/hooks/useFormField.js

import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { usePostHelper } from "../api/postHelper";

const useFormField = (
  initialValue,
  refetchValue,
  updateUrl,
  fieldName,
  refetchQueries,
  lineNo
) => {
  const queryClient = useQueryClient();
  const [value, setValue] = useState(initialValue);
  const [userChanged, setUserChanged] = useState(false);

  const mutation = usePostHelper(updateUrl, {
    onSuccess: (_, variables) => {
      setUserChanged(false);
      queryClient.invalidateQueries(refetchQueries);
    },
    onError: (_, variables) => {
      setUserChanged(false);
    },
  });

  // Sync with the fetched data when the value changes (if the user hasn't changed it)
  useEffect(() => {
    if (refetchValue !== undefined && !userChanged) {
      setValue(refetchValue);
    }
  }, [refetchValue, userChanged]);

  // Handle user input change
  const handleChange = (newValue) => {
    setValue(newValue);
    setUserChanged(true);
  };

  // Handle blur (when the user finishes editing)
  const handleBlur = (onBlurCallback) => {
    if (userChanged && !mutation.isPending) {
      const payload = { field: fieldName, updatedValue: value.trim() };

      if (lineNo !== undefined) {
        payload.lineNo = lineNo; // Only add lineNo if it's defined
      }

      mutation.mutate(payload);

      // Optionally, execute the passed callback
      if (onBlurCallback) {
        onBlurCallback(value);
      }
    }
  };

  return {
    value,
    handleChange,
    handleBlur,
    isLoading: mutation.isPending,
  };
};

export default useFormField;
