//
// server/jobs/updateWorkTable.js

import { query } from "../back-end/configs/db.config.js";

export const updateWorkTable = async () => {
  const workTableQuery = `
    -- Step 1: Insert new rows or update existing rows
    INSERT INTO work_table_v2 (
        item_no,
        quantity_required,
        quantity_quote
    )
    SELECT
        pr.item_no,
        GREATEST(pr.quantity_required - IFNULL(ic.available_inventory, 0), 0) AS quantity_required,
        GREATEST(pr.quantity_quote - GREATEST(IFNULL(ic.available_inventory, 0) - pr.quantity_required, 0), 0) AS quantity_quote
    FROM
        (
            SELECT
                ol.item_no,
                SUM(
                    CASE WHEN o.quote = 0 AND o.consolidated = 0 AND ol.shipped = 0 AND ol.active = 1 THEN ol.quantity ELSE 0
                END
                ) AS quantity_required,
                SUM(
                    CASE WHEN o.quote = 1 THEN ol.quantity ELSE 0
                END
                ) AS quantity_quote
            FROM
                orders_list AS ol
            JOIN orders AS o
            ON
                ol.order_no = o.order_no
            WHERE
                ol.active = 1 AND ol.posted = 0
            GROUP BY
                ol.item_no
        ) AS pr
    LEFT JOIN (
            SELECT
                item_no,
                SUM(
                    CASE WHEN TYPE IN (2, 3, 4) THEN quantity ELSE 0
                END
                ) - SUM(
                    CASE WHEN TYPE IN (1, 5) THEN quantity ELSE 0
                END
                ) AS available_inventory
            FROM
                item_entries
            GROUP BY
                item_no
        ) AS ic
    ON
        pr.item_no = ic.item_no
    ON DUPLICATE KEY UPDATE
        quantity_required = VALUES(quantity_required),
        quantity_quote = VALUES(quantity_quote);

    -- Step 2: Delete rows that are no longer needed
    DELETE FROM work_table_v2
    WHERE
        (quantity_required = 0 AND quantity_quote = 0)
        OR item_no NOT IN (
            SELECT DISTINCT item_no
            FROM (
                SELECT ol.item_no
                FROM orders_list AS ol
                JOIN orders AS o ON ol.order_no = o.order_no
                WHERE ol.active = 1 AND ol.posted = 0 AND ol.shipped = 0
                UNION
                SELECT item_no
                FROM item_entries
            ) AS active_items
        );
`;

  try {
    await query(workTableQuery);
  } catch (error) {
    console.log("Failed to update work table: " + error.message);
  }
};
