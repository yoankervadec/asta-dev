//
// server/back-end/models/production/selectProductionList.js

import { query } from "../../configs/db.config.js";

export const selectProductionList = async () => {
  try {
    const result = await query(
      `
      SELECT
        ol.order_no,
        cl.name,
        ol.line_no,
        ol.whs_id,
        ol.item_no,
        pr.thickness,
        pr.width,
        pr.length,
        pr.type,
        ol.quantity AS quantity_ordered,
        COALESCE(re_totals.total_reserved, 0) AS quantity_reserved,
        ol.quantity - COALESCE(re_totals.total_reserved, 0) AS quantity_required,
        o.priority,
        o.required_date,
        o.created_at
      FROM
        orders_list AS ol
      JOIN
        orders AS o ON ol.order_no = o.order_no
      JOIN
        products AS pr ON ol.item_no = pr.item_no
      JOIN
        clients AS cl ON o.client_id = cl.client_id
      LEFT JOIN (
        SELECT
          order_no,
          line_no,
          SUM(quantity_reserved) AS total_reserved
        FROM reservation_entries
        GROUP BY order_no, line_no
      ) AS re_totals ON ol.order_no = re_totals.order_no AND ol.line_no = re_totals.line_no
      WHERE
        ol.shipped = 0
        AND ol.active = 1
        AND ol.posted = 0
        AND ol.status != 1
        AND o.posted = 0
        AND o.quote = 0
      ORDER BY
        o.priority,
        o.required_date,
        pr.type
      `
    );

    return result;
  } catch (error) {
    throw new Error("Failed to select Production List: " + error.message);
  }
};
