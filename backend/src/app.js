import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import memberRoutes from "./routes/member.routes.js";
import planRoutes from "./routes/plan.routes.js";
import memberShipRoutes from "./routes/membership.routes.js"
import paymentRoutes from "./routes/payment.routes.js"
import dashboardRoutes from "./routes/dashboard.routes.js";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/plan", planRoutes);
app.use("/api/membership",memberShipRoutes)
app.use("/api/payments",paymentRoutes)
app.use("/api/dashboard", dashboardRoutes);
export default app;
