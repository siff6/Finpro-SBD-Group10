import { Router } from "express";
import {
    getCompanies,
    getCompanyById,
    createCompany,
    updateCompany,
    deleteCompany,
} from "../controllers/companies.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyToken);

router.get("/", getCompanies);
router.get("/:id", getCompanyById);
router.post("/", createCompany);
router.put("/:id", updateCompany);
router.delete("/:id", deleteCompany);

export default router;