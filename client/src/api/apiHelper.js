//
// client/src/api/apiHelper/apiHelper.js

import axios from "axios";
import { useModalStore } from "../store/useModalStore";

const api = axios.create({
  baseURL: "/api",
  timeout: 7000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export async function apiHelper(endpoint, options = {}, navigate = null) {
  let timeoutId;
  try {
    // Set a timeout to open the "loading" modal after 1 second
    timeoutId = setTimeout(() => {
      useModalStore.getState().openModal("progress", {
        message: "This request is taking longer than usual...",
      });
    }, 2000); // 2 seconds before panic

    const response = await api({
      url: endpoint,
      method: options.method || "GET",
      data: options.body || null,
      params: options.params || null, // Use for GET query params
    });

    clearTimeout(timeoutId); // clear timeout
    useModalStore.getState().closeModal("progress"); // close progress modal

    const data = response.data;

    if (data.authentification !== true) {
      if (navigate) navigate("/login");
      return null;
    }

    // Open confirmation modal if API requests it
    if (data?.data.requiresConfirmation) {
      useModalStore.getState().openModal("confirmation", {
        message: data?.data.confirmationMessage,
        action: data?.data.confirmationAction,
        body: data?.data?.body || {},
      });
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId); // clear timeout if error
    useModalStore.getState().closeModal("progress"); // close progress if error

    if (error.response.data.authentification !== true) {
      if (navigate) navigate("/login");
      return null;
    }

    // Get error message (fallback to generic message)
    const errorMessage = error.response?.data?.error || "Something went wrong";

    // Open ErrorModal
    useModalStore.getState().openModal("error", {
      status: error.response?.status || 500,
      message: errorMessage,
      details: error.response?.data?.message || null,
    });

    throw errorMessage;
  }
}
