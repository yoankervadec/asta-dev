//
// server/back-end/services/itemEntries/fetchViewItemEntries.js

import { viewItemEntries } from "../../models/itemEntries/viewItemEntries.js";
import { isValidNumberOrNull } from "../../utils/typeCheck/typeCheck.js";
import { selectSingleProduct } from "../../models/products/selectSingleProduct.js";
import { AppError } from "../../utils/errorHandling/AppError.js";
import { formatDate } from "../../utils/dates/dateHelper.js";

export const fetchViewItemEntries = async (
  entryNo = null,
  warehouseId = null,
  transactionId = null,
  itemNo = null,
  documentNo = null
) => {
  try {
    if (
      !isValidNumberOrNull(entryNo) ||
      !isValidNumberOrNull(warehouseId) ||
      !isValidNumberOrNull(transactionId) ||
      !isValidNumberOrNull(documentNo)
    ) {
      throw new AppError(400, "Invalid parameters.");
    }

    if (itemNo !== null) {
      const validProduct = await selectSingleProduct(itemNo);
      if (validProduct === null) {
        throw new AppError(400, `Invalid Item Number: ${itemNo}.`);
      }
    }

    const data = await viewItemEntries(
      entryNo,
      warehouseId,
      transactionId,
      itemNo,
      documentNo
    );

    const lines = data.map((line) => {
      return {
        entryNo: line.entry_no,
        entryTypeId: line.entry_type_id,
        entryTypeName: line.entry_type_name,
        warehouse: {
          warehouseId: line.whs_id,
          warehouseName: line.whs_name,
        },
        item: {
          itemNo: line.item_no,
          description: line.description,
          quantity: line.quantity,
          attributes: {
            attributesIdSetAsString: line.attr_id_set_as_string,
            attributesNameSetAsString: line.attr_name_set_as_string,
            attributes: line.attr_as_array,
          },
          costAsDecimal: parseFloat(line.cost),
          costAsString:
            line.cost.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            }) || "0.00",
        },
        documents: {
          transactionId: line.transaction_id,
          documentNo: line.document_no,
        },
        details: {
          createdAt: formatDate(line.created_at),
        },
      };
    });

    // console.log(JSON.stringify(lines, null, 2));
    return lines;
  } catch (error) {
    throw error;
  }
};
