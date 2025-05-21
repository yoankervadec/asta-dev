//
// server/back-end/models/customerOrderServices/insertServiceLine.js

import { query } from "../../configs/db.config.js";

export const insertServiceLine = async (orderNo, lineNo, serviceId) => {
  try {
    await query(
      `
      INSERT INTO
        orders_list_services (
          order_no,
          line_no,
          service_id
        )
      VALUES
        (?, ?, ?)
      `,
      [orderNo, lineNo, serviceId]
    );
  } catch (error) {
    throw new Error("Failed to insert Service Line: " + error.message);
  }
};
