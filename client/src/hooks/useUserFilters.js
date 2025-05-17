//
// client/src/hooks/useUserFilters.js

import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const COOKIE_EXPIRATION_DAYS = 7;

export const useUserFilters = (defaultFilters, cookieKey) => {
  const [filters, setFiltersState] = useState(defaultFilters);

  // Load filters from cookies on initial render
  useEffect(() => {
    const storedFilters = Cookies.get(cookieKey);
    if (storedFilters) {
      try {
        const parsed = JSON.parse(storedFilters);
        setFiltersState({ ...defaultFilters, ...parsed });
      } catch (err) {
        console.error("Invalid filter cookie:", err);
      }
    }
  }, [cookieKey]);

  const setFilters = (newFilters) => {
    const updatedFilters = {
      ...filters,
      ...newFilters,
    };

    // Remove empty or undefined keys
    Object.keys(updatedFilters).forEach((key) => {
      if (updatedFilters[key] === undefined || updatedFilters[key] === "") {
        delete updatedFilters[key];
      }
    });

    // Save to state and cookies
    setFiltersState(updatedFilters);
    Cookies.set(cookieKey, JSON.stringify(updatedFilters), {
      expires: COOKIE_EXPIRATION_DAYS,
    });
  };

  return { filters, setFilters };
};
