import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

// Debug
import user from "./models/user.model.js";

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
    origin(origin, cb) {
      const allowed = [
        process.env.CLIENT_URL,
        "http://localhost:5173",
        "http://localhost:3000",
      ]
        .filter(Boolean)
        .some((o) => origin?.startsWith(o));
      if (!origin || allowed || origin.endsWith(".netlify.app")) {
        cb(null, true);
      } else {
        cb(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.get("/api/debug/users", async (req, res) => {
  const count = await user.countDocuments({});
  const admin = await user.findOne({ role: "admin" }).select("email name phone");
  res.json({ count, admin });
});

app.use("/api/auth", authRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/plan", planRoutes);
app.use("/api/membership",memberShipRoutes)
app.use("/api/payments",paymentRoutes)
app.use("/api/dashboard", dashboardRoutes);
export default app;
