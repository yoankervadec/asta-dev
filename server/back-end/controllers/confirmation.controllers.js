//
// server/back-end/controllers/confirmation.controllers.js

import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseHelper.js";

export const handleRequestConfirmation = async (req, res) => {
  const { action } = req.params;
  const isAuthenticated = req.session?.userId;

  let message, confirmationUrl;

  switch (action) {
    // From POS
    case "void-transaction":
      sendSuccessResponse(
        res,
        200,
        {
          requiresConfirmation: true,
          confirmationMessage: "Do you want to void the transaction?",
          confirmationAction: "/pos/voidTransaction",
          body: req.body,
        },
        isAuthenticated
      );
      break;
    // From POS
    case "void-stage-line":
      sendSuccessResponse(
        res,
        200,
        {
          requiresConfirmation: true,
          confirmationMessage: "Do you want to void the transaction line?",
          confirmationAction: "/pos/voidLine",
          body: req.body,
        },
        isAuthenticated
      );
      break;
    // From customer order
    case "cancel-line":
      sendSuccessResponse(
        res,
        200,
        {
          requiresConfirmation: true,
          confirmationMessage: "Do you want to cancel the order line?",
          confirmationAction: "/customer-order/cancel-line",
          body: req.body,
        },
        isAuthenticated
      );
      break;
    case "ship":
      sendSuccessResponse(
        res,
        200,
        {
          requiresConfirmation: true,
          confirmationMessage: `Do you want to ship the all the "Ready" lines?`,
          confirmationAction: "/customer-order/ship",
          body: req.body,
        },
        isAuthenticated
      );
      break;
    case "post-session":
      sendSuccessResponse(
        res,
        200,
        {
          requiresConfirmation: true,
          confirmationMessage: `Do you want to commit the inventory changes?`,
          confirmationAction: "/production/session/post",
          body: req.body,
        },
        isAuthenticated
      );
      break;
    default:
      sendErrorResponse(
        res,
        500,
        "Invalid request",
        "Invalid request",
        isAuthenticated
      );
  }
};
