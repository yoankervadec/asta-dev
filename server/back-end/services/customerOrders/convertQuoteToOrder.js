//
// server/back-end/services/customerOrders/convertQuoteToOrder.js

import { getConnection } from "../../configs/db.config.js";
import { AppError } from "../../utils/errorHandling/AppError.js";

import { alterOrder } from "./alterOrder.js";
import { updateOrderHeader } from "../../models/customerOrders/updateOrderHeader.js";
import { insertTransaction } from "../../models/transactions/insertTransaction.js";
import { isValidNumberOrNull } from "../../utils/typeCheck/typeCheck.js";

export const convertQuoteToOrder = async (orderNo, createdBy) => {
  const connection = await getConnection();

  try {
    await connection.beginTransaction();

    if (orderNo !== null && isValidNumberOrNull(orderNo)) {
      await updateOrderHeader(orderNo, "quote", 0);
      await insertTransaction(connection, orderNo, 3, createdBy, 0);
    } else {
      throw new AppError(400, `Invalid order number: ${orderNo}`);
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
