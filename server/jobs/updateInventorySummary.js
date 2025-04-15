//
// server/jobs/updateInventorySummary.js

import { query } from "../back-end/configs/db.config.js";

export const updateInventorySummary = async () => {
  try {
    const startTime = performance.now();

    const result = await query(
      `
      UPDATE inventory_summary AS inv
      JOIN (
        SELECT
          pr.item_no,
          COALESCE(inv.actual_inventory, 0) AS actual_inventory,
          COALESCE(res.quantity_on_orders, 0) AS quantity_on_orders,
          COALESCE(res.quantity_reserved, 0) AS quantity_reserved
        FROM
          products AS pr
        LEFT JOIN (
          -- Calculate actual inventory
          SELECT
            item_no, 
            SUM(CASE WHEN TYPE IN (2, 3, 4) THEN quantity ELSE 0 END) - 
            SUM(CASE WHEN TYPE IN (1, 5) THEN quantity ELSE 0 END) AS actual_inventory
          FROM
            item_entries
          GROUP BY
            item_no
        ) AS inv ON pr.item_no = inv.item_no
        LEFT JOIN (
          -- Calculate quantity on orders and reserved quantity
          SELECT
            ol.item_no,
            SUM(ol.quantity) AS quantity_on_orders,
            SUM(re.total_reserved) AS quantity_reserved
          FROM
            orders_list AS ol
          JOIN orders AS o 
            ON ol.order_no = o.order_no
          LEFT JOIN (
            -- Aggregate reservation quantities separately to avoid duplicate counts
            SELECT
              order_no,
              line_no,
              SUM(quantity_reserved) AS total_reserved
            FROM
              reservation_entries
            GROUP BY
              order_no, line_no
          ) AS re ON ol.order_no = re.order_no AND ol.line_no = re.line_no
          WHERE
            o.quote = 0         -- Not a quote
            AND o.posted = 0    -- Not posted
            AND ol.active = 1   -- Not canceled
            AND ol.shipped = 0  -- Not shipped
          GROUP BY
            ol.item_no
        ) AS res ON pr.item_no = res.item_no
      ) AS subquery ON inv.item_no = subquery.item_no
      SET 
        inv.actual_inventory = 
          CASE 
            WHEN inv.actual_inventory <> subquery.actual_inventory 
            THEN subquery.actual_inventory 
            ELSE inv.actual_inventory 
          END,
        inv.quantity_on_orders = 
          CASE 
            WHEN inv.quantity_on_orders <> subquery.quantity_on_orders 
            THEN subquery.quantity_on_orders 
            ELSE inv.quantity_on_orders 
          END,
        inv.quantity_reserved = 
          CASE 
            WHEN inv.quantity_reserved <> subquery.quantity_reserved 
            THEN subquery.quantity_reserved 
            ELSE inv.quantity_reserved 
          END,
        inv.last_updated = 
          CASE 
            WHEN inv.actual_inventory <> subquery.actual_inventory 
              OR inv.quantity_on_orders <> subquery.quantity_on_orders 
              OR inv.quantity_reserved <> subquery.quantity_reserved 
            THEN CURRENT_TIMESTAMP 
            ELSE inv.last_updated 
          END;
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
