//
// server/back-end/models/production/insertWorkSession.js

export const insertWorkSession = async (connection, userId) => {
  try {
    await connection.query(
      `
      INSERT INTO
        work_session_header(
          created_by
        )
      VALUES(?)
      `,
      [userId]
    );
  } catch (error) {
    throw new Error("Failed to insert new session: " + error.message);
  }
};
