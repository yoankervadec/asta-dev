//
// client/src/utils/fuzzySearch.js

import Fuse from "fuse.js";
import { normalizeString } from "./normalizeString";

export const fuzzySearch = (rows, filterText, fuzzyKeys, exactKeys) => {
  if (!filterText) return rows; // Return all rows if filter is empty

  const normalizedFilterText = normalizeString(filterText.toLowerCase());
  const isNumericSearch = /\d/.test(filterText); // Check if input is only numbers

  // 1. **Exact Match for Numbers (Phone Numbers, IDs)**
  const exactMatches = rows.filter((row) =>
    exactKeys.some((key) => {
      const value = key.split(".").reduce((obj, k) => obj?.[k], row);
      return (
        value != null &&
        normalizeString(String(value).toLowerCase()).includes(
          normalizedFilterText
        ) // Convert to string before `.includes()`
      );
    })
  );

  // 2. **Fuzzy Search for Non-Numeric Searches (Names, Descriptions)**
  const fuse = new Fuse(rows, {
    keys: fuzzyKeys,
    threshold: 0.3, // Adjust fuzzy sensitivity
    ignoreLocation: true,
    findAllMatches: true,
    includeScore: false,
    ignoreFieldNorm: true, // Prevents field length from affecting relevance
  });

  let fuzzyMatches = fuse.search(normalizedFilterText).map((r) => r.item);

  // 3. **Partial Match for Item Numbers (e.g., "1-4-10" should match "Pi1-4-10")**
  const partialMatches = rows.filter((row) =>
    fuzzyKeys.some((key) => {
      const value = key.split(".").reduce((obj, k) => obj?.[k], row);
      return (
        typeof value === "string" &&
        normalizeString(value.toLowerCase()).includes(normalizedFilterText)
      );
    })
  );

  // If searching for numbers, return only exact matches
  if (isNumericSearch) {
    return exactMatches;
  }

  // Combine fuzzy + partial matches + exact matches
  const resultSet = new Set([
    ...exactMatches,
    ...fuzzyMatches,
    ...partialMatches,
  ]);

  return Array.from(resultSet);
};
