//
// server/back-end/models/co/selectCoCard.js

import { query } from "../../configs/db.config.js";

export const selectCoCard = async (orderNo) => {
  try {
    const orderInformation = await query(
      `
      SELECT
        o.order_no,
        o.client_id,
        cl.name,
        cl.name2,
        cl.phone,
        cl.phone2,
        cl.email,
        cl.address,
        cl.city,
        cl.postal_code,
        cl.extra AS client_extra,
        o.created_at,
        o.required_date,
        o.quote,
        o.consolidated,
        o.priority,
        o.tax_region,
        tx.pst,
        tx.gst,
        o.extra AS order_extra,
        o.created_by
      FROM
        orders AS o
      JOIN
        clients AS cl ON o.client_id = cl.client_id
      JOIN
        taxes AS tx ON o.tax_region = tx.region
      WHERE
        o.order_no = ?
      `,
      [orderNo]
    );

    const itemsList = await query(
      `
      SELECT
        ol.order_no,
        ol.line_no,
        ol.item_no,
        pr.description,
        ol.quantity,
        ol.discount,
        ol.unit_price,
        ol.shipped,
        ol.active,
        ol.posted,
        ol.status AS status_id,
        ls.name AS status_name
      FROM
        orders_list AS ol
      JOIN
        products AS pr ON ol.item_no = pr.item_no
      JOIN
        orders_list_line_status AS ls ON ol.status = ls.id
      WHERE
        ol.order_no = ?
      `,
      [orderNo]
    );

    const paymentEntries = await query(
      `
      SELECT
        pe.entry_no,
        pe.transaction_id,
        tt.name,
        pe.date,
        pm.name AS payment_method,
        pe.payment_amount
      FROM
        payment_entries AS pe
      JOIN
        payment_methods AS pm ON  pe.payment_method = pm.id
      JOIN
        transactions AS tr ON pe.transaction_id = tr.transaction_id
      JOIN
        transaction_types AS tt ON tr.type = tt.id
      WHERE
        pe.order_no = ?
      `,
      [orderNo]
    );

    return { orderInformation, itemsList, paymentEntries };
  } catch (error) {
    throw new Error("Failed to fetch " + error.message);
  }
};
