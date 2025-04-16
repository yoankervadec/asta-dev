//
// server/back-end/mappings/alterOrderMapping.js

const alterOrderMapping = {
  // Order Header Validation
  requiredDate: {
    table: "orders",
    column: "required_date",
    validate: (value) => !isNaN(Date.parse(value)), // Valid date
  },
  priority: {
    table: "orders",
    column: "priority",
    validate: (value) => !isNaN(value) && value >= 0, // Non-negative number
  },
  consolidated: {
    table: "orders",
    column: "consolidated",
    validate: (value) => !isNaN(value) && value >= 0, // Non-negative number
  },
  orderExtra: { table: "orders", column: "extra" },

  // Clients Validation
  clientName: {
    table: "orders",
    column: "name",
    validate: (value) => typeof value === "string" && value.trim() !== "",
  },
  clientName2: {
    table: "orders",
    column: "name2",
    validate: (value) => typeof value === "string",
  },
  clientPhone: {
    table: "orders",
    column: "phone",
    validate: (value) => /^\d{3}-\d{3}-\d{4}$/.test(value), // Matches 555-555-5555 format
  },
  clientPhone2: {
    table: "orders",
    column: "phone2",
    validate: (value) =>
      value === "" || null || /^\d{3}-\d{3}-\d{4}$/.test(value),
  },
  clientEmail: {
    table: "orders",
    column: "email",
    validate: (value) =>
      typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  },
  clientAddress: {
    table: "orders",
    column: "address",
    validate: (value) => typeof value === "string" && value.trim() !== "",
  },
  clientCity: {
    table: "orders",
    column: "city",
    validate: (value) => typeof value === "string" && value.trim() !== "",
  },
  clientPostalCode: {
    table: "orders",
    column: "postal_code",
    validate: (value) => /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/.test(value),
  },
  clientExtra: {
    table: "clients",
    column: "extra",
  },
};

export default alterOrderMapping;
