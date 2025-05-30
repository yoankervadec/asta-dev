//
// server/jobs/updateLinesStatus.js

import { getConnection } from "../../back-end/configs/db.config.js";
import { LINE_STATUS } from "../../constant/customerOrderStatus.js";

export const updateLinesStatus = async () => {
  const connection = await getConnection();

  try {
    await connection.beginTransaction();
    const startTime = performance.now();

    // FETCH CUSTOMER ORDER LINES
    const [orderLines] = await connection.query(
      `
      SELECT
        ol.order_no,
        ol.line_no,
        ol.item_no,
        svc.service_as_array,
        ol.quantity AS quantity_ordered,
        COALESCE(SUM(re.quantity_reserved), 0) AS quantity_reserved,
        ol.shipped,
        ol.active,
        ol.posted,
        ol.status,
        st.name AS status_name
      FROM
        orders_list AS ol
        JOIN orders AS o ON ol.order_no = o.order_no
        LEFT JOIN reservation_entries AS re ON ol.order_no = re.order_no
        AND ol.line_no = re.line_no
        JOIN orders_list_line_status AS st ON ol.status = st.id
        LEFT JOIN (
          SELECT
            order_no,
            line_no,
            JSON_ARRAYAGG (
              JSON_OBJECT (
                'serviceId',
                services.service_id,
                'serviceName',
                services.service_name,
                'completed',
                orders_list_services.completed
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
      WHERE
        o.quote = 0 -- NOT A QUOTE
        AND o.posted = 0 -- NOT POSTED ORDER
        AND ol.posted = 0 -- NOT POSTED LINE
        AND ol.shipped = 0 -- NOT SHIPPED LINE
        AND ol.active = 1 -- NOT CANCELED
      GROUP BY
        ol.order_no,
        ol.line_no
      ORDER BY
        o.order_no DESC,
        ol.line_no ASC;
      `
    );

    // ARRAYS FOR UPDATES
    const linesReady = [];
    const linesWaiting = [];
    const linesServicePending = [];

    // HELPERS
    const hasServicesFullyComplete = (services) =>
      services.length === 0 || !services.some((s) => !s.completed);
    const isFullyReserved = (qtyOrdered, qtyReserved) =>
      qtyOrdered === qtyReserved;

    for (const line of orderLines) {
      const services = line.service_as_array || [];
      const quantityReserved = parseFloat(line.quantity_reserved);
      const {
        order_no: orderNo,
        line_no: lineNo,
        quantity_ordered: quantityOrdered,
        shipped,
        posted,
        active,
        status: lineStatusId,
      } = line;

      // READY
      if (
        lineStatusId !== LINE_STATUS.ready &&
        hasServicesFullyComplete(services) &&
        isFullyReserved(quantityOrdered, quantityReserved)
      ) {
        linesReady.push({ orderNo, lineNo, newStatus: LINE_STATUS.ready });

        // SERVICE PENDING
      } else if (
        lineStatusId !== LINE_STATUS.servicePending &&
        !hasServicesFullyComplete(services) &&
        isFullyReserved(quantityOrdered, quantityReserved)
      ) {
        linesServicePending.push({
          orderNo,
          lineNo,
          newStatus: LINE_STATUS.servicePending,
        });

        // WAITING
      } else if (
        lineStatusId !== LINE_STATUS.waiting &&
        !isFullyReserved(quantityOrdered, quantityReserved)
      ) {
        linesWaiting.push({ orderNo, lineNo, newStatus: LINE_STATUS.waiting });
      }
    }

    // Perform batched updates
    await updateLineStatuses(connection, linesReady, LINE_STATUS.ready);
    await updateLineStatuses(
      connection,
      linesServicePending,
      LINE_STATUS.servicePending
    );
    await updateLineStatuses(connection, linesWaiting, LINE_STATUS.waiting);

    const endTime = performance.now();
    const executionTime = (endTime - startTime).toFixed(2);

    await connection.commit();

    return {
      executionTime,
      linesReady: linesReady.length,
      linesServicePending: linesServicePending.length,
      linesWaiting: linesWaiting.length,
    };
  } catch (error) {
    await connection.rollback();
    throw new Error("Error updating order statuses: " + error.message);
  } finally {
    connection.release();
  }
};

// Batched update using WHERE IN
const updateLineStatuses = async (connection, lines, newStatus) => {
  if (lines.length === 0) return;

  const placeholders = lines.map(() => `(?, ?)`).join(", ");
  const values = lines.flatMap(({ orderNo, lineNo }) => [orderNo, lineNo]);

  await connection.query(
    `
    UPDATE orders_list
    SET status = ?
    WHERE (order_no, line_no) IN (${placeholders});
    `,
    [newStatus, ...values]
  );
};
