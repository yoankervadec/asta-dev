//
// server/back-end/models/customerOrders/viewOrderLines.js

import { query } from "../../configs/db.config.js";

export const viewOrderLines = async (
  quote = null,
  posted = null,
  orderNo = null,
  itemNo = null,
  lineNo = null,
  active = null,
  shipped = null
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
        pr.type,
        pr.thickness,
        pr.width,
        pr.length,
        GROUP_CONCAT(
          DISTINCT la.attr_id
          ORDER BY
            la.attr_id SEPARATOR ', '
        ) AS attr_id_set_as_string,
        GROUP_CONCAT(
          DISTINCT pa.attr_name
          ORDER BY
            la.attr_id SEPARATOR ', '
        ) AS attr_name_set_as_string,
        JSON_ARRAYAGG(
          JSON_OBJECT('attrId', la.attr_id, 'attrName', pa.attr_name)
        ) AS attr_as_array,
        svc.service_as_array,
        ol.quantity,
        ANY_VALUE(COALESCE(re_sum.quantity_reserved, 0)) AS quantity_reserved,
        ANY_VALUE(COALESCE(session_sum.quantity_on_session, 0)) AS quantity_on_session,
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
        JOIN products AS pr ON ol.item_no = pr.item_no
        JOIN orders AS o ON ol.order_no = o.order_no
        JOIN clients AS cl ON o.client_id = cl.client_id
        JOIN users AS usr ON o.created_by = usr.user_id
        JOIN taxes AS tx ON o.tax_region = tx.region
        JOIN orders_list_line_status AS st ON ol.status = st.id
        JOIN orders_list_line_attr AS la ON ol.line_no = la.line_no
        AND ol.order_no = la.order_no
        JOIN products_attr AS pa ON la.attr_id = pa.attr_id
        LEFT JOIN (
          SELECT
            order_no,
            line_no,
            JSON_ARRAYAGG(
              JSON_OBJECT(
                'serviceId',
                services.service_id,
                'serviceName',
                services.service_name,
                'serviceNameFr',
                services.service_name_fr,
                'serviceCostFactor',
                services.cost_factor,
                'completed',
                orders_list_services.completed,
                'completedAt',
                orders_list_services.completed_at
              )
            ) AS service_as_array
          FROM
            orders_list_services
            JOIN services ON orders_list_services.service_id = services.service_id
          GROUP BY
            order_no,
            line_no
        ) AS svc ON ol.order_no = svc.order_no
        AND ol.line_no = svc.line_no
        LEFT JOIN (
          SELECT
            order_no,
            line_no,
            SUM(quantity_reserved) AS quantity_reserved
          FROM
            reservation_entries
          GROUP BY
            order_no,
            line_no
        ) AS re_sum ON ol.order_no = re_sum.order_no
        AND ol.line_no = re_sum.line_no
        LEFT JOIN (
          SELECT
            wsl.reserved_for_order_no,
            wsl.reserved_for_order_line_no,
            SUM(wsl.quantity) AS quantity_on_session
          FROM
            work_session_lines AS wsl
            JOIN work_session_header AS wsh ON wsl.session_no = wsh.session_no
          WHERE
            wsh.posted = FALSE
          GROUP BY
            wsl.reserved_for_order_no,
            wsl.reserved_for_order_line_no
        ) AS session_sum ON ol.order_no = session_sum.reserved_for_order_no
        AND ol.line_no = session_sum.reserved_for_order_line_no
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
    if (lineNo !== null) {
      conditions.push("ol.line_no = ?");
      params.push(lineNo);
    }
    if (active !== null) {
      conditions.push("ol.active = ?");
      params.push(active);
    }
    if (shipped !== null) {
      conditions.push("ol.shipped = ?");
      params.push(shipped);
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
