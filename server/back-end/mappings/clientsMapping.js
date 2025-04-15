//
// server/back-end/mappings/clientsMapping.js

const clientsMapping = {
  name: {
    table: "clients",
    column: "name",
    validate: (value) => typeof value === "string" && value.trim() !== "",
    required: true, // Mandatory field
  },
  name2: {
    table: "clients",
    column: "name2",
    validate: (value) =>
      value === "" || value === null || typeof value === "string",
    required: false, // Optional field
  },
  phone: {
    table: "clients",
    column: "phone",
    validate: (value) =>
      typeof value === "string" &&
      value.trim() !== "" &&
      /^\d{3}-\d{3}-\d{4}$/.test(value), // Matches 555-555-5555 format
    required: true, // Mandatory field
  },
  phone2: {
    table: "clients",
    column: "phone2",
    validate: (value) =>
      value === "" || value === null || /^\d{3}-\d{3}-\d{4}$/.test(value),
    required: false, // Optional field
  },
  email: {
    table: "clients",
    column: "email",
    validate: (value) =>
      value === "" ||
      value === null ||
      (typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)),
    required: false, // Optional field
  },
  address: {
    table: "clients",
    column: "address",
    validate: (value) =>
      value === "" ||
      value === null ||
      (typeof value === "string" && value.trim() !== ""),
    required: false, // Optional field
  },
  city: {
    table: "clients",
    column: "city",
    validate: (value) =>
      value === "" ||
      value === null ||
      (typeof value === "string" && value.trim() !== ""),
    required: false, // Optional field
  },
  postal_code: {
    table: "clients",
    column: "postal_code",
    validate: (value) =>
      value === "" ||
      value === null ||
      /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/.test(value),
    required: false, // Optional field
  },
  extra: {
    table: "clients",
    column: "extra",
    validate: (value) =>
      value === "" || value === null || typeof value === "string",
    required: false, // Optional field
  },
  createdBy: {
    table: "clients",
    column: "created_by",
    validate: (value) => typeof value === "number" && !isNaN(value),
    required: true, // Mandatory field
  },
};

export default clientsMapping;
