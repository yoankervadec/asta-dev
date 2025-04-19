//
// server/back-end/models/clients/insertNewClient.js

import { query } from "../../configs/db.config.js";

export const insertNewClient = async (
  name,
  name2,
  phone,
  phone2,
  email,
  address,
  city,
  postalCode,
  extra,
  createdBy
) => {
  try {
    await query(
      `
      INSERT INTO
        clients (
          name,
          name2,
          phone,
          phone2,
          email,
          address,
          city,
          postal_code,
          extra,
          created_by
        )
      VALUES (?,?,?,?,?,?,?,?,?,?)
      `,
      [
        name,
        name2,
        phone,
        phone2,
        email,
        address,
        city,
        postalCode,
        extra,
        createdBy,
      ]
    );
  } catch (error) {
    throw new Error("Failed to insert Client: " + error.message);
  }
};
