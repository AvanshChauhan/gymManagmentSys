import express from "express";
import adminMiddleware from "../middlewares/admin.middleware.js";
import authMiddleWare from "../middlewares/auth.middleware.js";
import createPayment from "../controllers/payment/createPayment.controller.js";
import getPayment from "../controllers/payment/getPayments.controller.js";
import getSpecificPayment from "../controllers/payment/getSpecificPlan.controller.js";
import getPaymentsByMember from "../controllers/payment/getPaymentByMember.controller.js";
const router = express.Router();
router.post("/:id", authMiddleWare, adminMiddleware, createPayment);
router.get("/", authMiddleWare, adminMiddleware, getPayment);
router.get(
  "/member/:memberId",
  authMiddleWare,
  adminMiddleware,
  getPaymentsByMember
);
router.get("/:id", authMiddleWare, adminMiddleware, getSpecificPayment);
export default router;
