//
// server/back-end/mappings/alterProductMapping.js

const alterProductMapping = {
  itemNo: {
    table: "products",
    column: "item_no",
    validate: (value) => typeof value === "string" && value.trim() !== "",
  },
  description: {
    table: "products",
    column: "description",
    validate: (value) => typeof value === "string" && value.trim() !== "",
  },
  type: {
    table: "products",
    column: "type",
    validate: (value) => typeof value === "string" && value.trim() !== "",
  },
  thickness: {
    table: "products",
    column: "thickness",
    validate: (value) => parseFloat(value) > 0,
  },
  width: {
    table: "products",
    column: "width",
    validate: (value) => parseFloat(value) > 0,
  },
  length: {
    table: "products",
    column: "length",
    validate: (value) => parseFloat(value) > 0,
  },
  pricePerThousandToString: {
    table: "products",
    column: "pp_thousand",
    sanitize: (value) => parseFloat(value.toString().replace(/,/g, "")),
    validate: (value) => parseFloat(value.toString().replace(/,/g, "")) > 0,
  },
  costToString: {
    table: "products",
    column: "cost",
    validate: (value) => parseFloat(value) >= 0,
  },
};

export default alterProductMapping;
