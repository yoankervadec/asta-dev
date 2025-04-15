//
// server/back-end/services/clients/fetchAllClients.js

import { formatDate } from "../../utils/dates/dateHelper.js";
import { isValidNumberOrNull } from "../../utils/typeCheck/typeCheck.js";

import { selectAllClients } from "../../models/clients/selectAllClients.js";

export const fetchAllClients = async (clientId = null) => {
  try {
    if (!isValidNumberOrNull(clientId)) {
      throw {
        status: 400,
        message: `Failed to fetch order lines: Client ID "${clientId}" is invalid.`,
        title: "Contact Yoan.",
      };
    }
    const clients = await selectAllClients(clientId);

    const formattedClients = clients.map((client) => ({
      clientId: client.client_id,
      names: {
        name: client.name,
        name2: client.name2,
      },
      contact: {
        phone: client.phone,
        phone2: client.phone2,
        email: client.email,
      },
      location: {
        address: client.address,
        city: client.city,
        postalCode: client.postal_code,
      },
      extra: {
        extra: client.extra,
      },
      details: {
        createdAt: formatDate(client.created_at),
        createdByName: client.created_by,
      },
    }));

    return formattedClients;
  } catch (error) {
    throw new Error(error.message);
  }
};
