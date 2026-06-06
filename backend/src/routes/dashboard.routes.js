import express from "express";
import authMiddleWare from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";
import getStats from "../controllers/dashboard/getStats.controller.js";
import getPendingDues from "../controllers/dashboard/getPendingDues.controller.js";
import getExpiringMemberships from "../controllers/dashboard/getExpiringMemberships.controller.js";
import getRevenueDashboard from "../controllers/dashboard/getRevenueDashboard.controller.js";

const router = express.Router();

router.get("/stats", authMiddleWare, adminMiddleware, getStats);
router.get("/pending-dues", authMiddleWare, adminMiddleware, getPendingDues);
router.get(
  "/expiring-memberships",
  authMiddleWare,
  adminMiddleware,
  getExpiringMemberships
);
router.get("/revenue", authMiddleWare, adminMiddleware, getRevenueDashboard);

export default router;
