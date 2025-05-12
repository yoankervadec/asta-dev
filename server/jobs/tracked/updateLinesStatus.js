//
// server/jobs/updateLinesStatus.js

import { query } from "../../back-end/configs/db.config.js";

export const updateLinesStatus = async () => {
  try {
    const startTime = performance.now();

    const result = await query(
      `
      UPDATE orders_list AS ol
      JOIN (
        SELECT
          ol.order_no,
          ol.line_no,
          ol.quantity,
          COALESCE(SUM(re.quantity_reserved), 0) AS total_reserved
        FROM
          orders_list AS ol
        LEFT JOIN
          reservation_entries AS re ON ol.order_no = re.order_no
          AND ol.line_no = re.line_no
        JOIN
          orders AS o ON ol.order_no = o.order_no
        WHERE
          o.quote = 0
          AND o.posted = 0
          AND ol.active = 1
          AND ol.shipped = 0
        GROUP BY
          ol.order_no,
          ol.line_no,
          ol.quantity
      ) AS subquery ON ol.order_no = subquery.order_no 
                    AND ol.line_no = subquery.line_no
      SET ol.status = 
        CASE 
          WHEN subquery.total_reserved = subquery.quantity THEN 1
          WHEN subquery.total_reserved < subquery.quantity THEN 2
          ELSE ol.status
        END
      WHERE 
        (subquery.total_reserved = subquery.quantity AND ol.status != 1)
        OR (subquery.total_reserved < subquery.quantity AND ol.status != 2);;
      `
    );

    const endTime = performance.now();
    const executionTime = (endTime - startTime).toFixed(2); // Time in milliseconds

    return {
      rowsAffected: result.affectedRows,
      executionTime: `${executionTime} ms`,
    };
  } catch (error) {
    console.error("Error updating order statuses:", error.message);

    throw new Error("Scheduler job failed :" + error.message);
  }
};
