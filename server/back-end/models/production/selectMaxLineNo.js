//
// server/back-end/models/production/selectMaxLineNo.js

export const selectMaxLineNo = async (connection, sessionNo) => {
  try {
    const [result] = await connection.query(
      `
      SELECT
        MAX(line_no) AS line_no
      FROM
        work_session_lines
      WHERE
        session_no = ?
      `,
      [sessionNo]
    );
    return result[0]?.line_no ?? 0;
  } catch (error) {
    throw new Error("Failed to select line number: " + error.message);
  }
};
