//
// server/back-end/models/customerOrders/selectOrderLines.js

import { query } from "../../configs/db.config.js";

export const selectOrderLines = async (
  quote = null,
  posted = null,
  orderNo = null,
  clientId = null
) => {
  try {
    let sql = `
      SELECT
        ol.order_no,
        cl.client_id,
        ol.line_no,
        ol.item_no,
        pr.thickness,
        pr.width,
        pr.length,
        ol.quantity,
        ol.discount,
        ol.unit_price,
        tx.pst,
        tx.gst,
        ol.shipped,
        ol.active,
        ol.posted,
        ol.status,
        o.created_by
      FROM
        orders_list AS ol
      JOIN
        orders AS o ON ol.order_no = o.order_no
      JOIN
        products AS pr ON ol.item_no = pr.item_no
      JOIN
        clients AS cl ON o.client_id = cl.client_id
      JOIN
        taxes AS tx ON o.tax_region = tx.region
    `;

    // Add conditions dynamically
    const conditions = [];
    const params = [];

    if (orderNo !== null) {
      conditions.push("ol.order_no = ?");
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
      ORDER BY
        o.order_no DESC,
        ol.line_no ASC
    `;

    // Execute query
    const result = await query(sql, params);
    return result;
  } catch (error) {
    throw new Error(`Failed to select "Order Lines": ${error.message}`);
  }
};
