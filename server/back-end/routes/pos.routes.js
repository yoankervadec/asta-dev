//
// server/back-end/routes/pos.routes.js

import express from "express";

import {
  handleAddToCart,
  handleFetchPosPage,
  handleVoidTransactionLine,
  handleVoidTransaction,
  handleAlterCartProduct,
  handleAlterTransactionHeader,
  handleCreateOrder,
} from "../controllers/pos.controllers.js";

const router = express.Router();

router.post("/add-to-cart", handleAddToCart);
router.post("/voidTransaction", handleVoidTransaction);
router.post("/voidLine", handleVoidTransactionLine);
router.post("/updateLine", handleAlterCartProduct);
router.post("/update-header", handleAlterTransactionHeader);
router.post("/create-order", handleCreateOrder);
router.get("/pos", handleFetchPosPage);

export default router;
