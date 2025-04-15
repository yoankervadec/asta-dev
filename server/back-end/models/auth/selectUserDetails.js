//
// server/back-end/models/auth/selectUserDetails.js

import { query } from "../../configs/db.config.js";

export const selectUserDetails = async (userId) => {
  const result = await query(
    `
    SELECT
      user_id,
      user_name,
      name,
      region
    FROM
      users
    WHERE
      user_id = ?
    `,
    [userId]
  );

  return result[0];
};
