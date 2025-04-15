//
// server/back-end/models/products/selectPossibleAttributes.js

import { query } from "../../configs/db.config.js";

export const selectPossibleAttributes = async (attrId = null) => {
  try {
    let sql = `
      SELECT
        attr_id,
        attr_name
      FROM
        products_attr
      `;

    // Add conditions dynamically
    const conditions = [];
    const params = [];

    if (attrId !== null) {
      conditions.push("attr_id = ?");
      params.push(attrId);
    }

    // Append WHERE clause if conditions exist
    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(" AND ")}`;
    }

    const result = await query(sql, params);

    return result;
  } catch (error) {
    throw new Error("Failed to select Possible Attributes: " + error.message);
  }
};
