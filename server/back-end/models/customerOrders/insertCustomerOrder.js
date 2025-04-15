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
      INSERT INTO
        orders (
          client_id,
          required_date,
          quote,
          tax_region,
          extra,
          created_by
        )
      VALUES
        (?, ?, ?, ?, ?, ?)
      `,
      [clientId, requiredDate, quote, taxRegion, orderExtra, createdBy]
    );

    return result.insertId; // order_no
  } catch (error) {
    throw new Error("Failed to insert Customer Order Header: " + error.message);
  }
};
