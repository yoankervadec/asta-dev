//
// client/src/hooks/useUserFilters.js

import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Cookies from "js-cookie";

const COOKIE_EXPIRATION_DAYS = 7;

export const useUserFilters = (defaultFilters, cookieKey) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Convert search params to an object
  const getFiltersFromURL = () => {
    return Object.fromEntries(searchParams.entries());
  };

  // Merge default filters with URL params
  const filters = { ...defaultFilters, ...getFiltersFromURL() };

  // Update filters in URL and cookies
  const setFilters = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters };

    // Remove empty values
    Object.keys(updatedFilters).forEach((key) => {
      if (updatedFilters[key] === undefined || updatedFilters[key] === "") {
        delete updatedFilters[key];
      }
    });

    setSearchParams(updatedFilters);
    Cookies.set(cookieKey, JSON.stringify(updatedFilters), {
      expires: COOKIE_EXPIRATION_DAYS,
    });
  };

  // On first load, if no URL params exist, restore from cookies
  useEffect(() => {
    if (!searchParams.toString()) {
      const storedFilters = Cookies.get(cookieKey);
      if (storedFilters) {
        setSearchParams(JSON.parse(storedFilters));
      }
    }
  }, [cookieKey, searchParams, setSearchParams]);

  return { filters, setFilters };
};
