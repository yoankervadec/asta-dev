//
// server/back-end/services/production/fetchWorkSession.js

import { getConnection } from "../../configs/db.config.js";

import { selectActiveSessionHeader } from "../../models/production/selectActiveSessionHeader.js";
import { selectActiveSessionLines } from "../../models/production/selectActiveSessionLines.js";
import { selectSingleProduct } from "../../models/products/selectSingleProduct.js";

import { formatDate } from "../../utils/dates/dateHelper.js";

export const fetchWorkSession = async (itemNo = null) => {
  const connection = await getConnection();

  try {
    if (itemNo !== null) {
      const validProduct = await selectSingleProduct(itemNo);
      if (validProduct.length === 0) {
        throw {
          status: 400,
          message: `Invalid Item Number: "${itemNo}".`,
          title: "Invalid parameters.",
        };
      }
    }
    const header = await selectActiveSessionHeader();
    const sessionNo = header.session_no;

    const lines = await selectActiveSessionLines(sessionNo, itemNo);
    const formattedLines = lines.map(
      ({ attr_name_as_string, attr_as_array, ...line }) => ({
        ...line,
        attrNameAsString: attr_name_as_string,
        attrAsArray: JSON.parse(attr_as_array),
        createdAt: formatDate(line.created_at),
      })
    );

    return {
      header: {
        ...header,
        created_at: formatDate(header.created_at),
      },
      lines: formattedLines,
    };
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
};
