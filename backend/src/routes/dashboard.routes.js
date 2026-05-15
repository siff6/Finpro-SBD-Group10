import { Router } from "express";
import {
    getDashboardSummary,
    getDashboardStatusCount,
    getDashboardMonthlyProgress,
} from "../controllers/dashboard.controller.js";

const router = Router();

router.get("/summary", getDashboardSummary);
router.get("/status-count", getDashboardStatusCount);
router.get("/monthly-progress", getDashboardMonthlyProgress);

export default router;
