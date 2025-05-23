//
// server/jobs/updateInventorySummary.js

import { query } from "../../back-end/configs/db.config.js";

export const updateInventorySummary = async () => {
  try {
    const startTime = performance.now();

    const result = await query(
      `
      UPDATE inventory_summary AS inv
      JOIN (
          SELECT
              pr.item_no,
              COALESCE(inv_data.actual_inventory, 0) AS actual_inventory,
              COALESCE(ord_data.quantity_on_orders, 0) AS quantity_on_orders,
              COALESCE(res_data.quantity_reserved, 0) AS quantity_reserved
          FROM
              products AS pr
          LEFT JOIN (
              -- Actual inventory
              SELECT
                  item_no,
                  SUM(quantity) AS actual_inventory
              FROM
                  item_entries
              GROUP BY
                  item_no
          ) AS inv_data ON pr.item_no = inv_data.item_no
          LEFT JOIN (
              -- Quantity on orders
              SELECT
                  ol.item_no,
                  SUM(ol.quantity) AS quantity_on_orders
              FROM
                  orders_list AS ol
              JOIN orders AS o ON ol.order_no = o.order_no
              WHERE
                  o.posted = 0
                  AND o.quote = 0
                  AND ol.active = 1
                  AND ol.posted = 0
                  AND ol.shipped = 0
              GROUP BY
                  ol.item_no
          ) AS ord_data ON pr.item_no = ord_data.item_no
          LEFT JOIN (
              -- Quantity reserved
              SELECT
                  ol.item_no,
                  SUM(re.quantity_reserved) AS quantity_reserved
              FROM
                  reservation_entries AS re
              JOIN orders_list AS ol ON re.order_no = ol.order_no AND re.line_no = ol.line_no
              GROUP BY
                  ol.item_no
          ) AS res_data ON pr.item_no = res_data.item_no
      ) AS subquery ON inv.item_no = subquery.item_no
      SET
          inv.actual_inventory = subquery.actual_inventory,
          inv.quantity_on_orders = subquery.quantity_on_orders,
          inv.quantity_reserved = subquery.quantity_reserved,
          inv.last_updated = CURRENT_TIMESTAMP
      WHERE
          inv.actual_inventory <> subquery.actual_inventory
          OR inv.quantity_on_orders <> subquery.quantity_on_orders
          OR inv.quantity_reserved <> subquery.quantity_reserved;
      `
    );

    const endTime = performance.now();
    const executionTime = (endTime - startTime).toFixed(2); // Time in milliseconds

    return {
      rowsAffected: result.affectedRows,
      executionTime: `${executionTime} ms`,
    };
  } catch (error) {
    throw new Error("Scheduler job failed: " + error.message);
  }
};
