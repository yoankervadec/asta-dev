//
// server/back-end/services/production/postWorkSession.js

import { getConnection } from "../../configs/db.config.js";

import { selectActiveSessionHeader } from "../../models/production/selectActiveSessionHeader.js";
import { updateWorkSession } from "../../models/production/updateWorkSession.js";
import { insertWorkItemEntries } from "../../models/production/insertWorkItemEntries.js";
import { insertWorkSession } from "../../models/production/insertWorkSession.js";
import { selectActiveSessionLines } from "../../models/production/selectActiveSessionLines.js";

const entryType = 3; // Production

export const postWorkSession = async (userId) => {
  const connection = await getConnection();

  try {
    // Begin Transaction
    await connection.beginTransaction();

    // Fetch sessionNo
    const sessionInfo = await selectActiveSessionHeader();
    const sessionNo = sessionInfo.session_no;
    if (!sessionNo) {
      throw {
        status: 500,
        message: "Failed to fetch session",
      };
    }

    // Fetch session lines
    const sessionLines = await selectActiveSessionLines(sessionNo);
    if (sessionLines.length === 0) {
      throw {
        status: 400,
        message: `Cannot post session "${sessionNo}" with 0 active lines.`,
      };
    }

    // Actual operation here
    await insertWorkItemEntries(connection, entryType, sessionNo);
    await updateWorkSession(connection, sessionNo);
    await insertWorkSession(connection, userId);

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
