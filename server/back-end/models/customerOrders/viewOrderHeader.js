//
// server/back-end/models/customerOrders/viewOrderHeader.js

import { query } from "../../configs/db.config.js";

export const viewOrderHeader = async (
  quote = null,
  posted = null,
  orderNo = null,
  clientId = null
) => {
  try {
    let sql = `
      SELECT
        o.order_no,
        o.client_id,
        o.name,
        o.name2,
        o.phone,
        o.phone2,
        o.email,
        o.address,
        o.city,
        o.postal_code,
        cl.extra AS client_extra,
        cl.created_at AS client_created_at,
        ucl.name AS client_created_by,
        o.required_date,
        o.quote,
        o.priority,
        o.consolidated,
        o.has_invoice,
        COALESCE(COUNT(ih.invoice_no), 0) AS invoice_count,
        o.posted,
        o.tax_region,
        o.extra AS order_extra,
        o.created_at AS order_created_at,
        uo.name AS order_created_by
      FROM
        orders AS o
      JOIN
        clients AS cl ON o.client_id = cl.client_id
      JOIN
        users AS uo ON o.created_by = uo.user_id
      JOIN
        users AS ucl ON cl.created_by = ucl.user_id
      LEFT JOIN
        invoice_headers AS ih ON o.order_no = ih.order_no
      `;

    // Add conditions dynamically
    const conditions = [];
    const params = [];

    if (orderNo !== null) {
      conditions.push("o.order_no = ?");
      params.push(orderNo);
    }
    if (quote !== null) {
      conditions.push("o.quote = ?");
      params.push(quote);
    }
    if (posted !== null) {
      conditions.push("o.posted = ?");
      params.push(posted);
    }
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
      GROUP BY
        o.order_no
      ORDER BY
        o.order_no DESC
    `;

    // Execute query
    const result = await query(sql, params);
    return result;
  } catch (error) {
    throw new Error(
      `Failed to select "View Customer Order Header": ${error.message}`
    );
  }
};
