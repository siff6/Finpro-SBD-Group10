import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import {
    getApplications,
    getApplicationById,
    createApplication,
    updateApplication,
    deleteApplication,
} from "../controllers/applications.controller.js";

const router = Router();

router.get("/", verifyToken, getApplications);
router.get("/:id", verifyToken, getApplicationById);
router.post("/", verifyToken, createApplication);
router.put("/:id", verifyToken, updateApplication);
router.delete("/:id", verifyToken, deleteApplication);

export default router;