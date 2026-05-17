import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import {
    getDashboardSummary,
    getDashboardStatusCount,
    getDashboardMonthlyProgress,
} from "../controllers/dashboard.controller.js";

const router = Router();

router.get("/summary", verifyToken, getDashboardSummary);
router.get("/status-count", verifyToken, getDashboardStatusCount);
router.get("/monthly-progress", verifyToken, getDashboardMonthlyProgress);

export default router;