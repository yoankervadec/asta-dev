//
// server/back-end/models/production/selectProductionList.js

import { query } from "../../configs/db.config.js";

export const selectProductionList = async () => {
  try {
    const result = await query(
      `
      SELECT
        ol.order_no,
        ol.line_no,
        ol.whs_id,
        ol.item_no,
        pr.thickness,
        pr.width,
        pr.length,
        pr.type,
        ol.quantity,
        o.priority,
        o.required_date,
        o.created_at
      FROM
        orders_list AS ol
      JOIN
        orders AS o ON ol.order_no = o.order_no
      JOIN
        products AS pr ON ol.item_no = pr.item_no
      WHERE
      -- All pending active ORDER lines
        ol.shipped = 0
        AND ol.active = 1
        AND ol.posted = 0
        AND ol.status != 1
        AND o.posted = 0
      ORDER BY
        o.priority DESC,
        o.required_date,
        pr.type
      `
    );

    return result;
  } catch (error) {
    throw new Error("Failed to select Production List: " + error.message);
  }
};
