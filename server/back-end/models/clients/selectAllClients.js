//
// server/back-end/models/clients/selectAllClients.js

import { query } from "../../configs/db.config.js";

export const selectAllClients = async (clientId = null) => {
  try {
    let sql = `
      SELECT
        cl.client_id,
        cl.name,
        cl.name2,
        cl.phone,
        cl.phone2,
        cl.email,
        cl.address,
        cl.city,
        cl.postal_code,
        cl.extra,
        cl.created_at,
        us.name AS created_by
      FROM
        clients AS cl
      JOIN
        users AS us ON cl.created_by = us.user_id
      `;

    // Add conditions dynamically
    const conditions = [];
    const params = [];

    if (clientId !== null) {
      conditions.push("cl.client_id = ?");
      params.push(clientId);
    }

    // Append WHERE clause if conditions exist
    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(" AND ")}`;
    }

    // Add ORDER BY clause
    sql += `
        ORDER BY
          cl.client_id DESC
        `;

    const result = await query(sql, params);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
