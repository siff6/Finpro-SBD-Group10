import { Router } from "express";
import {
    getApplications,
    getApplicationById,
    createApplication,
    updateApplication,
    deleteApplication,
} from "../controllers/applications.controller.js";

const router = Router();

router.get("/", getApplications);
router.get("/:id", getApplicationById);
router.post("/", createApplication);
router.put("/:id", updateApplication);
router.delete("/:id", deleteApplication);

export default router;
