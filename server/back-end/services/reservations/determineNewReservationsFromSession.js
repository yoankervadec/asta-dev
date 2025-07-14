//
// server/back-end/services/reservations/determineNewReservationsFromSession.js

import { AppError } from "../../utils/errorHandling/AppError.js";
import { fetchSessionLines } from "../production/fetchSessionLines.js";
import { fetchViewOrderLines } from "../customerOrders/fetchViewOrderLines.js";

export const determineNewReservationsFromSession = async (sessionNo) => {
  try {
    const sessionLines = await fetchSessionLines(sessionNo);

    const makeKey = (itemNo, attributeGroup) => `${itemNo}::${attributeGroup}`;

    let reservedLines = [];

    for (const line of sessionLines) {
      const { item, reservation } = line;

      if (reservation.reservedForOrder && reservation.reservedForLine) {
        const itemKey = makeKey(
          item.itemNo,
          item.attributes.attributeIdAsString
        );
        reservedLines.push({
          itemKey,
          reservation,
          item,
        });
      }
    }

    const orderAllocations = new Map();

    for (const line of reservedLines) {
      const { itemKey, reservation, item } = line;
      const { reservedForOrder, reservedForLine } = reservation;

      // Try to fetch matching customer order line
      const [customerOrderLine] = await fetchViewOrderLines(
        null,
        null,
        reservedForOrder,
        null,
        reservedForLine
      );

      if (!customerOrderLine) {
        // Real life: skip if the order line was deleted/cancelled
        console.warn(
          `Skipping reservation: no matching order line for order ${reservedForOrder}, line ${reservedForLine}`
        );
        continue;
      }

      const {
        orderNo,
        lineNo,
        item: {
          itemNo,
          quantity: quantityOrdered,
          quantityReserved,
          attributeIdSetAsString,
        },
      } = customerOrderLine;

      const expectedItemKey = makeKey(itemNo, attributeIdSetAsString);
      if (itemKey !== expectedItemKey) {
        // Real life: skip if product or attributes changed
        console.warn(
          `Skipping reservation: item key mismatch session(${itemKey}) vs order(${expectedItemKey})`
        );
        continue;
      }

      const orderLineKey = `${orderNo}::${lineNo}::${itemKey}`;

      const current = orderAllocations.get(orderLineKey) || {
        orderNo,
        lineNo,
        itemKey,
        quantity: 0,
      };

      const qtyNeeded = Math.max(quantityOrdered - quantityReserved, 0);
      const remainingQty = qtyNeeded - current.quantity;
      const qtyToAllocate = Math.min(item.quantity, remainingQty);

      if (qtyToAllocate > 0) {
        current.quantity += qtyToAllocate;
        orderAllocations.set(orderLineKey, current);
      } else {
        // Real life: already fully allocated
        console.info(
          `Order ${orderNo}, line ${lineNo} is already fully allocated (${quantityOrdered})`
        );
      }
    }

    return Array.from(orderAllocations.values());
  } catch (error) {
    throw error;
  }
};
