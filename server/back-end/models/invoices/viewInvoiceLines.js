//
// server/back-end/models/invoices/viewInvoiceLines.js

import { query } from "../../configs/db.config.js";

export const viewInvoiceLines = async (invoiceNo = null, orderNo = null) => {
  try {
    let sql = `
      SELECT
        il.invoice_no,
        il.order_no,
        il.line_no,
        cl.client_id,
        o.name,
        o.phone,
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
        ih.created_at,
        usr.name AS created_by
      FROM
        invoice_lines AS il
      JOIN
        orders_list AS ol ON il.order_no = ol.order_no
        AND il.line_no = ol.line_no
      JOIN
        invoice_headers AS ih ON il.order_no = ih.order_no
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
        orders_list_line_attr AS la ON ol.line_no = la.line_no
        AND ol.order_no = la.order_no
      JOIN
        products_attr AS pa ON la.attr_id = pa.attr_id
    `;

    const conditions = [];
    const params = [];

    if (invoiceNo !== null) {
      conditions.push("il.invoice_no = ?");
      params.push(invoiceNo);
    }
    if (orderNo !== null) {
      conditions.push("il.order_no = ?");
      params.push(orderNo);
    }

    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(" AND ")}`;
    }

    sql += `
      GROUP BY
        ih.invoice_no,
        il.line_no,
        cl.client_id,
        cl.name,
        cl.phone,
        pr.description,
        ol.quantity,
        ol.discount,
        ol.unit_price,
        tx.pst,
        tx.gst,
        ih.created_at,
        usr.name
      ORDER BY
        o.order_no DESC,
        ol.line_no ASC
    `;

    const result = await query(sql, params);
    return result;
  } catch (error) {
    throw new Error("Failed to select Invoice Lines: " + error.message);
  }
};
