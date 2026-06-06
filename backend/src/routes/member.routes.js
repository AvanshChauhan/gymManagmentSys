import express from "express";
import authMiddleWare from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";
import createMember from "../controllers/member/createMember.controller.js";
import getAllMembers from "../controllers/member/getMembers.controller.js";
import getSpecificMember from "../controllers/member/getSpecificMember.controller.js";
import updateAnUser from "../controllers/member/updateMember.controller.js";
import deleteAnUser from "../controllers/member/deleteMember.controller.js";
import searchMembers from "../controllers/member/searchMember.controller.js";
const router = express.Router();

router.post("/", authMiddleWare, adminMiddleware, createMember);

router.get("/", authMiddleWare, adminMiddleware, getAllMembers);
router.get("/search", authMiddleWare, adminMiddleware, searchMembers);
router.get("/getAllmembers", authMiddleWare, adminMiddleware, getAllMembers);
router.post("/getAllmembers", authMiddleWare, adminMiddleware, getAllMembers);
router.get("/:id", authMiddleWare, adminMiddleware, getSpecificMember);
router.patch("/:id", authMiddleWare, adminMiddleware, updateAnUser);
router.delete("/:id", authMiddleWare, adminMiddleware, deleteAnUser);
export default router;
