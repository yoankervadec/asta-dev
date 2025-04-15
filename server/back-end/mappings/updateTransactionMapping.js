//
// server/back-end/mappings/updateTransactionMapping.js

const updateTransactionMapping = {
  clientName: {
    table: "clients",
    column: "name",
    validate: (value) => typeof value === "string" && value.trim() !== "",
  },
  clientPhone: {
    table: "clients",
    column: "phone",
    validate: (value) => /^\d{3}-\d{3}-\d{4}$/.test(value), // Matches 555-555-5555 format
  },
  clientPhone2: {
    table: "clients",
    column: "phone2",
    validate: (value) =>
      value === "" || null || /^\d{3}-\d{3}-\d{4}$/.test(value),
  },
  clientEmail: {
    table: "clients",
    column: "email",
    validate: (value) =>
      value === null ||
      value === "" ||
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  },
  clientAddress: {
    table: "clients",
    column: "address",
    validate: (value) => typeof value === "string" || value === null,
  },
  clientCity: {
    table: "clients",
    column: "city",
    validate: (value) => typeof value === "string" || value === null,
  },
  clientPostalCode: {
    table: "clients",
    column: "postal_code",
    validate: (value) =>
      value === "" ||
      value === null ||
      /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/.test(value),
  },
  orderExtra: { table: "transaction_header", column: "extra" },
  quote: {
    table: "transaction_header",
    column: "quote",
    validate: (value) => typeof value === "boolean",
  },
  requiredDate: {
    table: "transaction_header",
    column: "required_date",
    validate: (value) => !isNaN(Date.parse(value)), // Valid date
  },
  paymentMethod: {
    table: "transaction_header",
    column: "payment_method",
    validate: (value) => !isNaN(value),
  },
  paymentAmount: {
    table: "transaction_header",
    column: "payment_amount",
    validate: (value) => !isNaN(value) && value >= 0, // Non-negative number
  },
};

export default updateTransactionMapping;
