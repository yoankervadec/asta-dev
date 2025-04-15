//
// server/back-end/services/products/fetchProducts.js

import { formatDate } from "../../utils/dates/dateHelper.js";
import { returnBoardfeet } from "../../utils/financial/returnBoardfeet.js";
import { returnUnitPrice } from "../../utils/financial/returnUnitPrice.js";
import { selectProducts } from "../../models/products/selectProducts.js";
import { selectProductsWithAttributes } from "../../models/products/selectProductsWithAttributes.js";
import { selectSingleProduct } from "../../models/products/selectSingleProduct.js";
import { fetchPossibleAttributes } from "./fetchPossibleAttributes.js";

export const fetchProducts = async (itemNo = null) => {
  try {
    if (itemNo !== null) {
      const validProduct = await selectSingleProduct(itemNo);
      if (validProduct.length === 0 || validProduct === null) {
        throw {
          status: 400,
          message: `Invalid Item Number: "${itemNo}".`,
          title: "Invalid parameters.",
        };
      }
    }
    const rows = await selectProducts(itemNo);
    const attributes = await fetchPossibleAttributes();
    const inventoryPerAttributes =
      itemNo !== null ? await selectProductsWithAttributes(itemNo) : null;

    const mapInventoryAttributes = (inventoryRows) => {
      return inventoryRows.map((row) => ({
        itemNo: row.item_no,
        quantity: row.total_quantity,
        attributeIdsAsString: row.attr_id_set_as_string,
        attributeNamesAsString: row.attr_name_set_as_string,
        attributes: row.attr_as_array ? JSON.parse(row.attr_as_array) : [], // Convert to JSON
      }));
    };

    const products = rows.map((row) => {
      const boardfeet = returnBoardfeet(row.thickness, row.width, row.length);
      const pricePerThousand = parseFloat(row.pp_thousand);
      const cost = parseFloat(row.cost);
      const unitPrice = returnUnitPrice(pricePerThousand, boardfeet);
      const availableInventory = Math.max(
        row.actual_inventory - row.quantity_on_orders,
        0
      );

      return {
        itemNo: row.item_no,
        naming: {
          description: row.description,
          type: row.type,
        },
        dimensions: {
          thickness: row.thickness,
          width: row.width,
          length: row.length,
        },
        inventory: {
          availableInventory,
          actualInventory: row.actual_inventory,
          quantityOnOrders: row.quantity_on_orders,
          quantityReserved: row.quantity_reserved,
          ...(inventoryPerAttributes
            ? {
                inventoryPerAttributes: mapInventoryAttributes(
                  inventoryPerAttributes
                ),
              }
            : {}),
        },
        pricing: {
          pricePerThousandAsDecimal: pricePerThousand,
          pricePerThousandToString: pricePerThousand.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          }),
          unitPriceAsDecimal: unitPrice,
          unitPriceToString: unitPrice.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          }),
          costAsDecimal: cost,
          costToString: cost.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          }),
          boardfeetToDecimal: boardfeet,
          boardfeetToString: boardfeet.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          }),
        },
        details: {
          createdAt: formatDate(row.created_at),
          createdById: row.created_by_id,
          createdByName: row.created_by_name,
        },
        possibleAttributes: attributes,
      };
    });
    // console.log(JSON.stringify(products, null, 2));

    return products;
  } catch (error) {
    throw error;
  }
};
