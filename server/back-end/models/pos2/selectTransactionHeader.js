//
// server/back-end/models/pos2/selectTransactionHeader.js

import { query } from "../../configs/db.config.js";

export const selectTransactionHeader = async (createdBy) => {
  try {
    const result = await query(
      `
      SELECT
        th.transaction_type,
        tt.name AS transaction_type_name,
        th.client_id,
        cl.name,
        cl.name2,
        cl.phone,
        cl.phone2,
        cl.email,
        cl.address,
        cl.city,
        cl.postal_code,
        cl.extra AS client_extra,
        th.required_date,
        th.payment_method,
        pm.name AS payment_method_name,
        th.payment_amount,
        th.quote,
        th.tax_region,
        tx.pst,
        tx.gst,
        th.extra,
        th.created_at,
        th.created_by,
        u.user_name As created_by_name_short,
        u.name AS created_by_name
      FROM
        transaction_header AS th
      LEFT JOIN
        transaction_types AS tt ON th.transaction_type = tt.id
      LEFT JOIN
        clients AS cl ON th.client_id = cl.client_id
      LEFT JOIN
        payment_methods AS pm ON th.payment_method = pm.id
      LEFT JOIN
        taxes AS tx ON th.tax_region = tx.region
      LEFT JOIN
        users AS u ON th.created_by = u.user_id
      WHERE
        th.created_by = ?
      `,
      [createdBy]
    );

    return result[0];
  } catch (error) {
    throw new Error(`Failed to select Transaction Header: ${error.message}`);
  }
};
