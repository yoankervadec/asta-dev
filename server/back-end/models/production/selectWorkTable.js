//
// server/back-end/models/production/selectWorkTable.js

import { query } from "../../configs/db.config.js";

export const selectWorkTable = async () => {
  try {
    const result = await query(
      `
        WITH latest_active_session AS (
          -- Get the latest active session
          SELECT
            session_no
          FROM
            work_session_header
          WHERE
            posted = 0 -- Only select active sessions
          ORDER BY
            created_at DESC
          LIMIT 1
        ),
        fulfilled_quantities AS (
            -- Sum the quantities for each item in the latest active session
          SELECT
            wsl.item_no,
            SUM(wsl.quantity) AS quantity_fulfilled
          FROM
            work_session_lines AS wsl
          JOIN
            latest_active_session AS las
          ON
            wsl.session_no = las.session_no
          GROUP BY
            wsl.item_no
        )
        SELECT
          wt.line_no AS work_line_no,
          wt.item_no AS work_item_no,
          wt.quantity_required,
          wt.quantity_quote,
          wt.created_at,
          wt.updated_at,
          COALESCE(fq.quantity_fulfilled, 0) AS quantity_fulfilled,
          ol.order_no,
          cl.name AS client_name,
          ol.item_no AS order_item_no,
          ol.line_no AS order_line_no,
          ol.quantity AS order_quantity,
          ol.discount,
          ol.unit_price,
          ol.active,
          ol.posted,
          ol.status,
          o.quote
        FROM
          work_table_v2 AS wt
        LEFT JOIN
          fulfilled_quantities AS fq ON wt.item_no = fq.item_no
        LEFT JOIN
          orders_list AS ol ON wt.item_no = ol.item_no
        JOIN
          orders AS o ON ol.order_no = o.order_no
        JOIN
          clients AS cl ON o.client_id = cl.client_id
        JOIN
          products AS pr ON ol.item_no = pr.item_no
        WHERE
          o.consolidated = 0
          AND ol.active = 1
          AND ol.posted = 0
          AND ol.shipped = 0
          AND ol.status != 1
          AND wt.quantity_required != 0
        ORDER BY
          pr.type DESC,
          pr.length DESC,
          pr.thickness DESC,
          pr.width DESC;
      `
    );
    return result;
  } catch (error) {
    throw new Error("Failed to select work table: " + error.message);
  }
};
