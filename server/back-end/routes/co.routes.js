//
// server/back-end/routes/co.routes.js

import express from "express";

import {
  handleFetchCoCard,
  handleAddPayment,
  handleFetchOrdersList,
  handleShipCustomerOrder,
  handleFetchCustomerOrders,
  handleAlterOrder,
  handleCancelCoLine,
  handleAddCustomerOrderLine,
} from "../controllers/co.controllers.js";

const router = express.Router();

router.get("/card/:order_no", handleFetchCoCard);
router.get("/orders-list", handleFetchOrdersList);
router.get("/customer-orders", handleFetchCustomerOrders);
router.post("/card/pay", handleAddPayment);
router.post("/card/alter/:order_no", handleAlterOrder);
router.post("/ship", handleShipCustomerOrder);
router.post("/cancel-line", handleCancelCoLine);
router.post("/add-line", handleAddCustomerOrderLine);

export default router;
