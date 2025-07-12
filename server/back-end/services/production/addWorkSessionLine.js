//
// server/back-end/services/production/addWorkSessionLine.js

import { getConnection } from "../../configs/db.config.js";
import { AppError } from "../../utils/errorHandling/AppError.js";

import { insertWorkSessionLine } from "../../models/production/insertWorkSessionLine.js";
import { selectActiveSessionHeader } from "../../models/production/selectActiveSessionHeader.js";
import { selectMaxLineNo } from "../../models/production/selectMaxLineNo.js";
import { selectPossibleAttributes } from "../../models/products/selectPossibleAttributes.js";
import { insertWorkSessionLineAttribute } from "../../models/production/insertWorkSessionLineAttribute.js";
import { fetchViewOrderLines } from "../customerOrders/fetchViewOrderLines.js";

export const addWorkSessionLine = async (
  itemNo,
  quantity,
  attributes = [],
  orderDetails = null,
  createdBy
) => {
  // Initialize connection
  const connection = await getConnection();
  console.log(attributes);

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

    if (orderDetails?.orderNo && orderDetails.lineNo) {
      const [customerOrderLine] = await fetchViewOrderLines(
        null,
        null,
        orderDetails.orderNo,
        null,
        orderDetails.lineNo
      );

      if (
        !customerOrderLine ||
        customerOrderLine?.status?.active === 0 ||
        customerOrderLine?.status?.shipped === 1
      ) {
        var attributesMatch = false;
      } else {
        const expectedAttrIds = customerOrderLine.item.attributeIdSetAsString
          .split(",")
          .map((s) => parseInt(s.trim(), 10))
          .sort((a, b) => a - b);

        const providedAttrIds = [...attributes].sort((a, b) => a - b);

        const arraysEqual = (a, b) => {
          if (a.length !== b.length) return false;
          return a.every((val, index) => val === b[index]);
        };

        var attributesMatch = arraysEqual(expectedAttrIds, providedAttrIds);
      }
    } else {
      var attributesMatch = false; // if not reserving an order line
    }

    await insertWorkSessionLine(
      connection,
      sessionNo,
      lineNo + 1,
      itemNo,
      quantity,
      attributesMatch ? orderDetails?.orderNo : null,
      attributesMatch ? orderDetails?.lineNo : null,
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
