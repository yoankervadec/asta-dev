//
// server/back-end/models/customerOrderServices/selectServiceConfig.js

import { query } from "../../configs/db.config.js";

export const selectServiceConfig = async (serviceId) => {
  try {
    const result = await query(
      `
      SELECT
        service_id,
        service_name,
        service_name_fr,
        cost_factor,
        removes_attributes,
        add_attributes
      FROM
        services
      WHERE
        service_id = ?
      `,
      [serviceId]
    );

    return result;
  } catch (error) {
    throw new Error("Failed to select Service Configuration: " + error.message);
  }
};
