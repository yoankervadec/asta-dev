//
// server/back-end/services/pos/addToCart.js

import { getConnection } from "../../configs/db.config.js";

import { selectMaxLineNo } from "../../models/pos/selectMaxLineNo.js";
import { selectSingleProduct } from "../../models/products/selectSingleProduct.js";
import { selectPossibleAttributes } from "../../models/products/selectPossibleAttributes.js";
import { insertToCart } from "../../models/pos/insertToCart.js";
import { insertToCartAttributes } from "../../models/pos/insertToCartAttributes.js";

import { returnBoardfeet } from "../../utils/financial/returnBoardfeet.js";
import { returnUnitPrice } from "../../utils/financial/returnUnitPrice.js";

import { AppError } from "../../utils/errorHandling/AppError.js";

export const addToCart = async (itemNo, attribute, quantity, createdBy) => {
  // Initialize connection
  const connection = await getConnection();
  try {
    // Begin transaction
    await connection.beginTransaction();

    let attributes = attribute?.attributes || [];

    // Fetch the lineNo
    let lineNo = await selectMaxLineNo(createdBy);

    if (!quantity || isNaN(quantity) || quantity <= 0) {
      throw new AppError(400, "Invalid quantity entered.");
    }

    // Fetch and validate product information
    const product = await selectSingleProduct(itemNo);
    if (itemNo === null || itemNo === undefined || product === null) {
      throw new AppError(400, `Invalid Item No. : "${itemNo}".`);
    }

    // Extract product details
    const { pp_thousand: pricePerThousand, thickness, width, length } = product;
    lineNo += 1;
    const boardfeet = returnBoardfeet(thickness, width, length);
    const unitPrice = returnUnitPrice(pricePerThousand, boardfeet);
    const discPercentage = 0;

    // Insert Transaction Line
    await insertToCart(
      connection,
      lineNo,
      itemNo,
      quantity,
      unitPrice,
      discPercentage,
      createdBy
    );

    // Insert transaction attributes
    if (
      attributes.length === 0 ||
      attributes === undefined ||
      attributes === null
    ) {
      attributes = [{ attrId: 1 }]; // default to [1] if invalid
    }

    // Validate and insert transaction attributes
    await Promise.all(
      attributes.map(async ({ attrId }) => {
        const validAttr = await selectPossibleAttributes(attrId);
        if (validAttr.length > 0) {
          await insertToCartAttributes(connection, lineNo, attrId, createdBy);
        } else {
          throw new AppError(400, `Invalid attribute ID: ${attrId}`);
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
