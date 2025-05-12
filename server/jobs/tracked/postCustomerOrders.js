//
// server/jobs/postCustomerOrders.js

import { getConnection } from "../../back-end/configs/db.config.js";

// "works" bu posts Shipped with Balance...
export const postCustomerOrders = async () => {
  const connection = await getConnection();

  try {
    const startTime = performance.now();
    await connection.beginTransaction();

    const [ordersListResult] = await connection.query(
      `
      UPDATE
        orders_list
      SET
        posted = 1
      WHERE
        (shipped = 1 OR active = 0)
        AND posted = 0
      `
    );

    // Update orders
    const [ordersResult] = await connection.query(
      `
      UPDATE orders o
      SET o.posted = 1
      WHERE o.posted = 0
        AND NOT EXISTS (
          SELECT 1
          FROM orders_list ol
          WHERE ol.order_no = o.order_no
            AND ol.posted = 0
        )
      `
    );

    await connection.commit();
    const endTime = performance.now();

    return {
      executionTime: `${(endTime - startTime).toFixed(2)} ms`,
      ordersListUpdated: ordersListResult.affectedRows,
      ordersUpdated: ordersResult.affectedRows,
    };
  } catch (error) {
    await connection.rollback();
    throw new Error("Scheduler job failed: " + error.message);
  } finally {
    connection.release();
  }
};
