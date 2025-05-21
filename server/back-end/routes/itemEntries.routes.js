//
// server/back-end/routes/itemEntries.routes.js

import express from "express";

import { handleFetchViewItemEntries } from "../controllers/itemEntries.controllers.js";

const router = express.Router();

router.get("/item-entries", handleFetchViewItemEntries);

export default router;
