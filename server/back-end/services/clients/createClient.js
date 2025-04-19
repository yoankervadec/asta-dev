//
// server/back-end/services/clients/createClient.js

import { insertNewClient } from "../../models/clients/insertNewClient.js";

import clientsMapping from "../../mappings/clientsMapping.js";
import { AppError } from "../../utils/errorHandling/AppError.js";

export const createClient = async (
  name,
  name2,
  phone,
  phone2,
  email,
  address,
  city,
  postalCode,
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
          throw new AppError(400, `"${key}" is required.`);
        }
        if (!fieldMapping.validate(value)) {
          throw new AppError(400, `Invalid value for "${key}"`);
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
      postalCode,
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
      postalCode,
      extra,
      createdBy
    );
  } catch (error) {
    throw error;
  }
};
