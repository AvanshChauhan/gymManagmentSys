import express from "express";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import memberRoutes from "./routes/member.routes.js";
import planRoutes from "./routes/plan.routes.js";
import memberShipRoutes from "./routes/membership.routes.js"
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/plan", planRoutes);
app.use("/api/membership",memberShipRoutes)
export default app;
