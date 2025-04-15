//
// server/back-end/models/products/selectProducts.js

import { query } from "../../configs/db.config.js";

export const selectProducts = async (itemNo = null) => {
  try {
    let sql = `
      SELECT
          pr.item_no,
          pr.description,
          pr.type,
          pr.pp_thousand,
          pr.thickness,
          pr.width,
          pr.length,
          pr.cost,
          pr.created_at,
          pr.created_by AS created_by_id,
          us.name AS created_by_name,
          inv.actual_inventory,
          inv.quantity_on_orders,
          inv.quantity_reserved
      FROM
        products AS pr
      JOIN
        inventory_summary AS inv ON pr.item_no = inv.item_no
      JOIN
        users AS us ON pr.created_by = us.user_id
      `;

    // Add conditions dynamically
    const conditions = [];
    const params = [];

    if (itemNo !== null) {
      conditions.push("pr.item_no = ?");
      params.push(itemNo);
    }

    // Append WHERE clause if conditions exist
    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(" AND ")}`;
    }

    // Add ORDER BY clause
    sql += `
        ORDER BY
          pr.item_no
      `;

    const result = await query(sql, params);
    return result;
  } catch (error) {
    throw new Error("Failed to select Products: " + error.message);
  }
};
