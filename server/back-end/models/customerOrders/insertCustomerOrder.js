//
// server/back-end/models/customerOrders/insertCustomerOrder.js

export const insertCustomerOrder = async (
  connection,
  clientId,
  requiredDate,
  quote,
  taxRegion,
  orderExtra,
  createdBy
) => {
  try {
    const [result] = await connection.query(
      `
      INSERT INTO orders (
        client_id,
        name,
        name2,
        phone,
        phone2,
        email,
        address,
        city,
        postal_code,
        required_date,
        quote,
        tax_region,
        extra,
        created_by
      )
      SELECT
        c.client_id,
        c.name,
        c.name2,
        c.phone,
        c.phone2,
        c.email,
        c.address,
        c.city,
        c.postal_code,
        ?, ?, ?, ?, ?
      FROM clients c
      WHERE c.client_id = ?
      `,
      [requiredDate, quote, taxRegion, orderExtra, createdBy, clientId]
    );

    return result.insertId; // order_no
  } catch (error) {
    throw new Error("Failed to insert Customer Order Header: " + error.message);
  }
};
