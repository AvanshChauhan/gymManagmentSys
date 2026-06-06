import express from "express";
const router = express.Router();
import assignMembership from "../controllers/membership/createMembership.controller.js";
import authMiddleWare from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";
import getAllMembership from "../controllers/membership/getMembership.controller.js";
import getSpecificMembership from "../controllers/membership/getSpecificMembership.controller.js";
import renewMembership from "../controllers/membership/renewMembership.controller.js";
router.post("/", authMiddleWare, adminMiddleware, assignMembership);
router.get("/",authMiddleWare,authMiddleWare,getAllMembership)
router.get("/:id",authMiddleWare,adminMiddleware,getSpecificMembership)
router.patch("/:id/renew",authMiddleWare,adminMiddleware,renewMembership)
export default router;
