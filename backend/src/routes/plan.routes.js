import express from "express"
import authMiddleWare from "../middlewares/auth.middleware.js"
import adminMiddleware from "../middlewares/admin.middleware.js"
import createPlan from "../controllers/plans/createPlan.controller.js"
import getAllplan from "../controllers/plans/getAllplan.controller.js"
import specificPlan from "../controllers/plans/getSpecificPlan.controller.js"
const router=express.Router()
router.post("/",authMiddleWare,adminMiddleware,createPlan)
router.get("/plans",authMiddleWare,adminMiddleware,getAllplan)
router.get("/:id",authMiddleWare,adminMiddleware,specificPlan)
export default router