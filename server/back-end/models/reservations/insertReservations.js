//
// server/back-end/models/reservations/insertReservations.js

export const insertReservations = async (
  connection,
  reservations = [],
  manualEntry = false
) => {
  if (!reservations.length) return;

  try {
    const values = [];
    const placeholders = reservations
      .map((r) => {
        values.push(r.orderNo, r.lineNo, r.quantity, manualEntry);
        return `(?, ?, ?, ?)`;
      })
      .join(", ");

    await connection.query(
      `
      INSERT INTO reservation_entries 
        (order_no, line_no, quantity_reserved, manual_entry)
      VALUES 
        ${placeholders}
      `,
      values
    );
  } catch (error) {
    throw new Error("Failed to insert reservation entry: " + error.message);
  }
};
