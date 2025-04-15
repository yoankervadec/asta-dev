//
// server/back-end/services/production/fetchWorkTable.js

import { selectWorkTable } from "../../models/production/selectWorkTable.js";

export const fetchWorkTable = async () => {
  try {
    const rows = await selectWorkTable();

    const result = rows.reduce((acc, row) => {
      const {
        work_line_no,
        work_item_no,
        quantity_required,
        quantity_quote,
        quantity_fulfilled,
        priority,
        created_at,
        updated_at,
        created_by,
        order_no,
        client_name,
        item_no,
        order_line_no,
        order_quantity,
        discount,
        unit_price,
        active,
        posted,
        status,
        quote,
      } = row;

      // Find or initialize the work table entry
      let workTableEntry = acc.find(
        (entry) => entry.work_line_no === work_line_no
      );
      if (!workTableEntry) {
        workTableEntry = {
          work_line_no,
          work_item_no,
          quantity_required,
          quantity_quote,
          quantity_fulfilled,
          remainingQuantity: Math.max(0, quantity_required - quantity_fulfilled),
          priority,
          created_at,
          updated_at,
          created_by,
          orders: [],
        };
        acc.push(workTableEntry);
      }

      // Add order details if present
      if (order_no !== null) {
        workTableEntry.orders.push({
          order_no,
          client_name,
          item_no,
          line_no: order_line_no,
          quantity: order_quantity,
          discount,
          unit_price,
          active,
          posted,
          status,
          quote,
        });
      }

      return acc;
    }, []);

    return result;
  } catch (error) {
    throw new Error("Failed to fetch work table: " + error.message);
  }
};
