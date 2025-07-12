//
// server/back-end/models/production/insertWorkSessionLine.js

export const insertWorkSessionLine = async (
  connection,
  sessionNo,
  sessionLineNo,
  itemNo,
  quantity,
  orderNo = null,
  orderLineNo = null,
  createdBy
) => {
  try {
    await connection.query(
      `
      INSERT INTO 
        work_session_lines (
          line_no,
          session_no,
          item_no,
          quantity,
          reserved_for_order_no,
          reserved_for_order_line_no,
          created_by
        )
        VALUES
          (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        sessionLineNo,
        sessionNo,
        itemNo,
        quantity,
        orderNo,
        orderLineNo,
        createdBy,
      ]
    );
  } catch (error) {
    throw new Error("Failed to insert quantity: " + error.message);
  }
};
