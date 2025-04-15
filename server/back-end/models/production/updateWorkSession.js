//
// server/back-end/models/production/updateWorkSession.js

export const updateWorkSession = async (connection, sessionNo) => {
  try {
    await connection.query(
      `
      UPDATE
        work_session_header
      SET
        posted = 1,
        posted_at = NOW()
      WHERE
        session_no = ?
      `,
      [sessionNo]
    );
  } catch (error) {
    throw new Error("Failed to post session: " + error.message);
  }
};
