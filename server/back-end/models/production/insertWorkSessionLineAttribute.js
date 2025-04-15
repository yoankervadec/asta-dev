//
// server/back-end/models/production/insertWorkSessionLineAttribute.js

export const insertWorkSessionLineAttribute = async (
  connection,
  lineNo,
  sessionNo,
  attrId
) => {
  try {
    await connection.query(
      `
      INSERT INTO
        work_session_line_attr (
          line_no,
          session_no,
          attr_id
        )
      VALUES
        (?, ?, ?)
      `,
      [lineNo, sessionNo, attrId]
    );
  } catch (error) {
    throw new Error("Failed to insert Attributes: " + error.message);
  }
};
