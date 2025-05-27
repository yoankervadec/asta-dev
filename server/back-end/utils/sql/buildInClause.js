//
// server/back-end/utils/sql/buildInClause.js

/**
 * Builds a WHERE clause with IN filters.
 *
 * @param {Object} columnsToValues - e.g., { 'ol.order_no': [123], 'ol.item_no': [456, 789] }
 * @param {string} joinWith - 'AND' | 'OR' (default is 'AND')
 *
 * @returns {Object} { whereClause: 'AND ...', params: [...] }
 */
export const buildInClause = (columnsToValues, joinWith = "AND") => {
  const filters = [];
  const params = [];

  for (const [column, values] of Object.entries(columnsToValues)) {
    if (Array.isArray(values) && values.length > 0) {
      filters.push(`${column} IN (${values.map(() => "?").join(",")})`);
      params.push(...values);
    }
  }

  const upperJoin = joinWith.toUpperCase() === "OR" ? "OR" : "AND";
  const whereClause = filters.length
    ? `AND (${filters.join(` ${upperJoin} `)})`
    : "";

  return { whereClause, params };
};
