import { Router } from "express";
import {
    getStatusHistory,
    updateApplicationStatus,
} from "../controllers/statusHistory.controller.js";

const router = Router();

router.get("/applications/:application_id/history", getStatusHistory);
router.patch("/applications/:application_id/status", updateApplicationStatus);

export default router;
