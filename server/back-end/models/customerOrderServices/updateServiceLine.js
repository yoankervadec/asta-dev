//
// server/back-end/models/customerOrderServices/updateServiceLine.js

export const updateServiceLine = async (
  connection,
  orderNo,
  lineNo,
  serviceId,
  field,
  value
) => {
  try {
    await connection.query(
      `
      UPDATE
        orders_list_services
      SET
        ${field} = ?
      WHERE
        order_no = ? AND
        line_no = ? AND
        service_id = ?
      `,
      [value, orderNo, lineNo, serviceId]
    );
  } catch (error) {
    throw new Error("Failed to update Service Line: " + error.message);
  }
};
