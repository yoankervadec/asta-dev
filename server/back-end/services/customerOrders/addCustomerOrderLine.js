//
// server/back-end/services/customerOrders/addCustomerOrderLine.js

import { getConnection } from "../../configs/db.config.js";

import { fetchViewOrderCard } from "./fetchViewOrderCard.js";
import { insertCustomerOrderLine } from "../../models/customerOrders/insertCustomerOrderLine.js";
import { insertCustomerOrderLineAttribute } from "../../models/customerOrders/insertCustomerOrderLineAttribute.js";
import { insertTransaction } from "../../models/transactions/insertTransaction.js";
import { selectSingleProduct } from "../../models/products/selectSingleProduct.js";
import { selectPossibleAttributes } from "../../models/products/selectPossibleAttributes.js";

import { returnBoardfeet } from "../../utils/financial/returnBoardfeet.js";
import { returnUnitPrice } from "../../utils/financial/returnUnitPrice.js";
import { isValidNumberOrNull } from "../../utils/typeCheck/typeCheck.js";
import { AppError } from "../../utils/errorHandling/AppError.js";

export const addCustomerOrderLine = async (
  orderNo,
  itemNo,
  quantity = 1,
  attributes = [],
  createdBy
) => {
  const connection = await getConnection();
  const WAREHOUSE_ID = 1; // YARD
  const TRANSACTION_TYPE = 3; // Payment

  try {
    if (
      !isValidNumberOrNull(orderNo) ||
      orderNo === null ||
      orderNo === undefined
    ) {
      throw new AppError(
        500,
        `Invalid Order Number: ${orderNo}`,
        "Failed to process request"
      );
    }

    if (!quantity || isNaN(quantity) || quantity <= 0) {
      throw new AppError(400, "Invalid quantity entered.");
    }

    await connection.beginTransaction();

    // Fetch and validate order information
    const { orderHeader, orderLines, paymentEntries } =
      await fetchViewOrderCard(orderNo);
    const addDisable = orderHeader.meta.toggles.addDisable;
    const maxLineNo =
      orderLines.length > 0
        ? Math.max(...orderLines.map((line) => line.lineNo))
        : 0;

    const lineNo = maxLineNo + 1;

    if (addDisable) {
      throw new AppError(
        400,
        "Failed to add Customer Order Line.",
        "This order is locked."
      );
    }

    // Fetch and validate product information
    const product = await selectSingleProduct(itemNo);
    if (itemNo === null || itemNo === undefined || product === null) {
      throw new AppError(400, `Invalid Item No. : "${itemNo}".`);
    }
    // Extract product details
    const { pp_thousand: pricePerThousand, thickness, width, length } = product;
    const boardfeet = returnBoardfeet(thickness, width, length);
    const unitPrice = returnUnitPrice(pricePerThousand, boardfeet);
    const discPercentage = 0;

    // Insert transaction
    await insertTransaction(connection, orderNo, TRANSACTION_TYPE, createdBy);

    // Insert customer order line
    await insertCustomerOrderLine(
      connection,
      orderNo,
      lineNo,
      WAREHOUSE_ID,
      itemNo,
      quantity,
      discPercentage,
      unitPrice
    );

    for (const attr of attributes.attributes) {
      // Insert orders list lines attributes
      await insertCustomerOrderLineAttribute(
        connection,
        orderNo,
        lineNo,
        attr.attrId
      );
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
