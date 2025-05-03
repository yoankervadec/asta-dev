//
// server/jobs/background/autoPostCustomerOrders.js

import { getConnection } from "../../back-end/configs/db.config.js";

export const autoPostCustomerOrders = async (orders) => {
  try {
    const eligibleOrders = [];

    for (const order of orders) {
      const { meta, totals } = order;

      const eligible =
        meta.status === "Shipped" ||
        meta.status === "Canceled" ||
        meta.status === "Canceled Quote";

      if (eligible && meta.posted === 0) {
        eligibleOrders.push(order.meta.orderNo);
      }
    }

    if (eligibleOrders.length > 0) {
      const connection = await getConnection();
      console.log("Posted Orders: " + eligibleOrders);
      try {
        await connection.beginTransaction();

        const placeholders = eligibleOrders.map(() => `?`).join(", ");
        const ordersSql = `
          UPDATE
            orders
          SET
            posted = 1
          WHERE
            order_no IN (${placeholders})
          `;

        const ordersListSql = `
            UPDATE
              orders_list
            SET
              posted = 1
            WHERE
              order_no IN (${placeholders})
          `;

        await Promise.all([
          connection.query(ordersSql, eligibleOrders),
          connection.query(ordersListSql, eligibleOrders),
        ]);

        await connection.commit();
      } catch (error) {
        await connection.rollback();
        console.warn(error);
      } finally {
        connection.release();
      }
    }
  } catch (error) {
    console.warn(error);
  }
};
