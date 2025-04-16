//
// server/back-end/models/customerOrders/viewOrderLines.js

import { query } from "../../configs/db.config.js";

export const viewOrderLines = async (
  quote = null,
  posted = null,
  orderNo = null,
  itemNo = null
) => {
  try {
    let sql = `
    SELECT
        ol.order_no,
        cl.client_id,
        o.name,
        o.phone,
        ol.line_no,
        ol.item_no,
        pr.description,
        GROUP_CONCAT(
            DISTINCT la.attr_id
            ORDER BY la.attr_id SEPARATOR ', '
        ) AS attr_id_set_as_string,
        GROUP_CONCAT(
            DISTINCT pa.attr_name
            ORDER BY la.attr_id SEPARATOR ', '
        ) AS attr_name_set_as_string,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'attrId', la.attr_id,
            'attrName', pa.attr_name
          )
        ) AS attr_as_array,
        ol.quantity,
        ol.discount,
        ol.unit_price,
        tx.pst,
        tx.gst,
        ol.shipped,
        ol.active,
        ol.posted,
        ol.status,
        st.name AS status_name,
        o.created_at,
        usr.name AS created_by
    FROM
        orders_list AS ol
        JOIN 
          products AS pr ON ol.item_no = pr.item_no
        JOIN 
          orders AS o ON ol.order_no = o.order_no
        JOIN 
          clients AS cl ON o.client_id = cl.client_id
        JOIN 
          users AS usr ON o.created_by = usr.user_id
        JOIN 
          taxes AS tx ON o.tax_region = tx.region
        JOIN 
          orders_list_line_status AS st ON ol.status = st.id
        JOIN 
          orders_list_line_attr AS la ON ol.line_no = la.line_no
          AND ol.order_no = la.order_no
        JOIN
          products_attr AS pa ON la.attr_id = pa.attr_id
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
    if (itemNo !== null) {
      conditions.push("ol.item_no = ?");
      params.push(itemNo);
    }

    // Append WHERE clause if conditions exist
    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(" AND ")}`;
    }

    // Add ORDER BY clause
    sql += `
      GROUP BY
        ol.order_no,
        ol.line_no,
        cl.client_id,
        cl.name,
        cl.phone,
        pr.description,
        ol.quantity,
        ol.discount,
        ol.unit_price,
        tx.pst,
        tx.gst,
        ol.shipped,
        ol.active,
        ol.posted,
        ol.status,
        st.name,
        o.created_at,
        usr.name
      ORDER BY
        o.order_no DESC,
        ol.line_no ASC
    `;

    // Execute query
    const result = await query(sql, params);
    return result;
  } catch (error) {
    throw new Error(`Failed to select view "Order Lines": ${error.message}`);
  }
};
