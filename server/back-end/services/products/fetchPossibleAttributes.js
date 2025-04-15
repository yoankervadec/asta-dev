//
// server/back-end/services/products/fetchPossibleAttributes.js

import { selectPossibleAttributes } from "../../models/products/selectPossibleAttributes.js";

export const fetchPossibleAttributes = async (attrId = null) => {
  try {
    const rows = await selectPossibleAttributes(attrId);

    return rows.map(({ attr_id, attr_name }) => ({
      attrId: attr_id,
      attrName: attr_name,
    }));
  } catch (error) {
    throw new Error("Failed to fetch Attributes: " + error.message);
  }
};
