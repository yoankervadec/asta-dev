//
// server/back-end/models/invoices/viewInvoiceHeaders.js

import { query } from "../../configs/db.config.js";

export const viewInvoiceHeaders = async (
  invoiceNo = null,
  orderNo = null,
  clientId = null
) => {
  try {
    let sql = `
      SELECT
        ih.invoice_no,
        ih.order_no,
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
        o.tax_region,
        o.extra AS order_extra,
        ih.created_at AS invoice_created_at,
        uo.name AS invoice_created_by_name
      FROM
        invoice_headers AS ih
      JOIN
        orders AS o ON ih.order_no = o.order_no
      JOIN
        clients AS cl ON o.client_id = cl.client_id
      JOIN
        users AS uo ON ih.created_by = uo.user_id
      JOIN
        users AS ucl ON cl.created_by = ucl.user_id    
    `;

    const conditions = [];
    const params = [];

    if (invoiceNo !== null) {
      conditions.push("ih.invoice_no = ?");
      params.push(invoiceNo);
    }
    if (orderNo !== null) {
      conditions.push("ih.order_no = ?");
      params.push(orderNo);
    }
    if (clientId !== null) {
      conditions.push("cl.client_id = ?");
      params.push(clientId);
    }

    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(" AND ")}`;
    }

    const result = await query(sql, params);
    return result;
  } catch (error) {
    throw new Error("Failed to select Invoice Headers: " + error.message);
  }
};
