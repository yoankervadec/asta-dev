//
// server/back-end/services/production/addWorkSessionLine.js

import { getConnection } from "../../configs/db.config.js";

import { insertWorkSessionLine } from "../../models/production/insertWorkSessionLine.js";
import { selectActiveSessionHeader } from "../../models/production/selectActiveSessionHeader.js";
import { selectMaxLineNo } from "../../models/production/selectMaxLineNo.js";
import { selectPossibleAttributes } from "../../models/products/selectPossibleAttributes.js";
import { insertWorkSessionLineAttribute } from "../../models/production/insertWorkSessionLineAttribute.js";

export const addWorkSessionLine = async (
  itemNo,
  quantity,
  attributes = [],
  createdBy
) => {
  // Initialize connection
  const connection = await getConnection();

  // Validate itemNo and quantity
  try {
    if (!itemNo || !quantity) {
      throw {
        status: 400,
        message: "Missing required fields.",
      };
    }
    if (quantity >= 100) {
      throw {
        status: 400,
        message: `Quantity "${quantity}" exceeds the max allowed "100".`,
      };
    }

    // Begin transaction
    await connection.beginTransaction();

    // Fetch and validate the active sessionNo
    const rawSession = await selectActiveSessionHeader(connection);
    const sessionNo = rawSession.session_no;
    if (!sessionNo || sessionNo === undefined || sessionNo === null) {
      throw {
        status: 500,
        message: "Could not find an active session.",
      };
    }

    // Fetch and validate the  lineNo
    const lineNo = await selectMaxLineNo(connection, sessionNo);
    if (lineNo === null || lineNo === undefined) {
      throw {
        status: 500,
        message: "Could not determine line number.",
      };
    }

    await insertWorkSessionLine(
      connection,
      sessionNo,
      lineNo + 1, // +1 to start at 1
      itemNo,
      quantity,
      createdBy
    );

    if (
      attributes.length === 0 ||
      attributes === undefined ||
      attributes === null
    ) {
      attributes = [1]; // default to [1] if invalid
    }
    await Promise.all(
      attributes.map(async (attrId) => {
        const validAttr = await selectPossibleAttributes(attrId);
        if (validAttr.length > 0) {
          await insertWorkSessionLineAttribute(
            connection,
            lineNo + 1,
            sessionNo,
            attrId
          );
        } else {
          throw {
            status: 500,
            message: "Could not validate Attributes.",
          };
        }
      })
    );

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
