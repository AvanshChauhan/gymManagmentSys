import express from "express";
import authMiddleWare from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";
import createMember from "../controllers/member/createMember.controller.js";
import getAllMembers from "../controllers/member/getMembers.controller.js";

const router = express.Router();

router.post("/", authMiddleWare, adminMiddleware, createMember);

router.get("/", authMiddleWare, adminMiddleware, getAllMembers);
router.get("/getAllmembers", authMiddleWare, adminMiddleware, getAllMembers);
router.post("/getAllmembers", authMiddleWare, adminMiddleware, getAllMembers);

export default router;
