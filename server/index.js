//
// server/index.js

import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";

import schedulerRoutes from "./back-end/routes/scheduler.routes.js";
import { isAuthenticated } from "./back-end/middleware/authMiddleware.js";
import authRoutes from "./back-end/routes/auth.routes.js";
import productsRoutes from "./back-end/routes/products.routes.js";
import clientRoutes from "./back-end/routes/clients.routes.js";
import posRoutes from "./back-end/routes/pos.routes.js";
import transactionRoutes from "./back-end/routes/transactions.routes.js";
import coRoutes from "./back-end/routes/co.routes.js";
import proRoutes from "./back-end/routes/production.routes.js";
import dashboardRoutes from "./back-end/routes/dashboard.routes.js";
import pdfRoutes from "./back-end/routes/pdf.routes.js";
import servicesRoutes from "./back-end/routes/services.routes.js";
import confirmationRoutes from "./back-end/routes/confirmation.routes.js";

// Middleware
dotenv.config();
const app = express();
app.use(express.json());

// CORS Configuration
const allowedOrigins = process.env.CORS_ORIGINS.split(",");

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(cookieParser());

// Session configuration
app.use(
  session({
    key: "user_id",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 1000 * 60 * 60 * 24,
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    },
  })
);

app.use("/scheduler", schedulerRoutes);
app.use("/auth", authRoutes);
app.use("/services", servicesRoutes);
app.use(isAuthenticated); //Auth check past this point
app.use("/product", productsRoutes);
app.use("/clients", clientRoutes);
app.use("/pos", posRoutes);
app.use("/transactions", transactionRoutes);
app.use("/customer-order", coRoutes);
app.use("/production", proRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/pdf", pdfRoutes);
app.use("/request", confirmationRoutes);

const PORT = process.env.PORT;

console.log(
  `Starting server in ${process.env.NODE_ENV} at port ${PORT} allowing ${allowedOrigins}.`
);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
