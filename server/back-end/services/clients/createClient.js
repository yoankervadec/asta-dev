//
// server/back-end/services/clients/createClient.js

import { insertNewClient } from "../../models/clients/insertNewClient.js";

import clientsMapping from "../../mappings/clientsMapping.js";

export const createClient = async (
  name,
  name2,
  phone,
  phone2,
  email,
  address,
  city,
  postal_code,
  extra,
  createdBy
) => {
  const validateFields = (fields) => {
    for (const [key, value] of Object.entries(fields)) {
      const fieldMapping = clientsMapping[key];
      if (fieldMapping) {
        if (
          fieldMapping.required &&
          (value === undefined || value === null || value === "")
        ) {
          throw {
            status: 400,
            message: `"${key}" is required.`,
          };
        }
        if (!fieldMapping.validate(value)) {
          throw {
            status: 400,
            message: `Invalid value for "${key}"`,
          };
        }
      }
    }
  };
  try {
    validateFields({
      name,
      name2,
      phone,
      phone2,
      email,
      address,
      city,
      postal_code,
      extra,
      createdBy,
    });
    await insertNewClient(
      name,
      name2,
      phone,
      phone2,
      email,
      address,
      city,
      postal_code,
      extra,
      createdBy
    );
  } catch (error) {
    throw new Error("Failed to create new client: " + error.message);
  }
};
