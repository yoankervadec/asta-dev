//
// server/back-end/models/production/insertWorkSessionLine.js

export const insertWorkSessionLine = async (
  connection,
  sessionNo,
  lineNo,
  itemNo,
  quantity,
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
          created_by
        )
        VALUES
          (?, ?, ?, ?, ?)
      `,
      [lineNo, sessionNo, itemNo, quantity, createdBy]
    );
  } catch (error) {
    throw new Error("Failed to insert quantity: " + error.message);
  }
};
