//
// server/back-end/routes/products.routes.js

import express from "express";

import {
  handleFetchAllProducts,
  handleCreateProduct,
  handleAlterProduct,
  handleFetchProductCard,
} from "../controllers/products.controllers.js";

const router = express.Router();

// Route to get all products
router.get("/products", handleFetchAllProducts);
router.get("/card/:itemNo", handleFetchProductCard);
router.post("/new-product", handleCreateProduct);
router.post("/alter/:itemNo", handleAlterProduct);

export default router;
