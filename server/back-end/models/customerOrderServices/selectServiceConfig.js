//
// server/back-end/models/customerOrderServices/selectServiceConfig.js

import { query } from "../../configs/db.config.js";

export const selectServiceConfig = async (serviceId = null) => {
  try {
    let sql = `
      SELECT
        service_id,
        service_name,
        service_name_fr,
        cost_factor,
        removes_attributes,
        add_attributes
      FROM
        services
      `;

    const conditions = [];
    const params = [];

    if (serviceId !== null) {
      conditions.push("service_id = ?");
      params.push(serviceId);
    }

    if (conditions.length > 0) {
      sql += `WHERE ${conditions.join(" AND ")}`;
    }

    const result = await query(sql, params);
    return result;
  } catch (error) {
    throw new Error("Failed to select Service Configuration: " + error.message);
  }
};
