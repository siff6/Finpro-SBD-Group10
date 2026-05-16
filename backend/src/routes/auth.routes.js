import express from "express";
import {
    register,
    login,
    verifyEmail,
    resendVerificationCode,
    forgotPassword,
    resetPassword,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification-code", resendVerificationCode);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;