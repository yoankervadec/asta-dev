//
// server/back-end/models/itemEntries/viewItemEntries.js

import { query } from "../../configs/db.config.js";

export const viewItemEntries = async (
  entryNo = null,
  warehouseId = null,
  transactionId = null,
  itemNo = null,
  documentNo = null
) => {
  try {
    let sql = `
      SELECT
        ie.entry_no,
        ie.whs_id,
        wl.whs_name,
        ie.transaction_id,
        ie.type AS entry_type_id,
        ie_type.name AS entry_type_name,
        ie.item_no,
        pr.description,
        GROUP_CONCAT(
          DISTINCT ie_attr.attr_id
          ORDER BY ie_attr.attr_id SEPARATOR ', '
        ) AS attr_id_set_as_string,
        GROUP_CONCAT(
          DISTINCT pr_attr.attr_name
          ORDER BY ie_attr.attr_id SEPARATOR ', '
        ) AS attr_name_set_as_string,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'attrId', ie_attr.attr_id,
            'attrName', pr_attr.attr_name
          )
        ) AS attr_as_array,
        ie.quantity,
        ie.cost,
        ie.document_no,
        ie.created_at
      FROM
        item_entries AS ie
      JOIN
        products AS pr ON ie.item_no = pr.item_no
      JOIN
        item_entries_attr AS ie_attr ON ie.entry_no = ie_attr.entry_no
      JOIN
        products_attr AS pr_attr ON ie_attr.attr_id = pr_attr.attr_id
      JOIN
        warehouse_locations AS wl ON ie.whs_id = wl.whs_id
      JOIN
        item_entry_types AS ie_type ON ie.type = ie_type.id
    `;

    const conditions = [];
    const params = [];

    if (entryNo !== null) {
      conditions.push("ie.entry_no = ?");
      params.push(entryNo);
    }
    if (warehouseId !== null) {
      conditions.push("ie.whs_id = ?");
      params.push(warehouseId);
    }
    if (transactionId !== null) {
      conditions.push("ie.transaction_id = ?");
      params.push(transactionId);
    }
    if (itemNo !== null) {
      conditions.push("ie.item_no = ?");
      params.push(itemNo);
    }
    if (documentNo !== null) {
      conditions.push("ie.document_no = ?");
      params.push(documentNo);
    }

    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(" AND ")}`;
    }

    sql += `
      GROUP BY
        ie.entry_no
      ORDER BY
        ie.entry_no DESC
      LIMIT 500
    `;

    const result = await query(sql, params);
    return result;
  } catch (error) {
    throw new Error("Failed to select view Item Entries: " + error.message);
  }
};
