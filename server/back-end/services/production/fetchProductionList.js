//
// server/back-end/services/production/fetchProductionList.js

import { format } from "date-fns";
import { formatDate } from "../../utils/dates/dateHelper.js";

import { selectProductionList } from "../../models/production/selectProductionList.js";
import { sortProductionList } from "./util/sortProductionList.js";

export const fetchProductionList = async (dateGroupRangeDays = 7) => {
  try {
    const rawLines = await selectProductionList();

    const lines = rawLines.map((line) => {
      return {
        orderNo: line.order_no,
        lineNo: line.line_no,
        quantityOrdered: line.quantity_ordered,
        quantityReserved: line.quantity_reserved,
        quantityRequired: line.quantity_required,
        client: line.name,
        item: {
          itemNo: line.item_no,
          type: line.type,
          dimensions: {
            thickness: line.thickness,
            width: line.width,
            length: line.length,
          },
        },
        priority: {
          priority: line.priority,
          requiredDateAsDate: line.required_date,
          requiredDate: format(new Date(line.required_date), "yyyy-MM-dd"),
          createdAtAsDate: line.created_at,
          createdAt: formatDate(line.created_at),
          createdAtTest: format(new Date(line.created_at), "yyyy-MM-dd"),
        },
        details: {
          whsId: line.whs_id,
        },
      };
    });

    const sortedLines = sortProductionList(lines, dateGroupRangeDays);

    console.log(JSON.stringify(sortedLines, null, 2));
    return sortedLines || [];
  } catch (error) {
    throw error;
  }
};
