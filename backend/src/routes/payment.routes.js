import express from "express";
import adminMiddleware from "../middlewares/admin.middleware.js";
import authMiddleWare from "../middlewares/auth.middleware.js";
import createPayment from "../controllers/payment/createPayment.controller.js";
import getPayment from "../controllers/payment/getPayments.controller.js";
const router = express.Router();
router.post("/:id", authMiddleWare, adminMiddleware, createPayment);
router.get("/",authMiddleWare,adminMiddleware,getPayment)
export default router