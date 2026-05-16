import { Router } from "express";
import {
    getReminders,
    getReminderById,
    createReminder,
    updateReminder,
    markReminderDone,
    deleteReminder,
} from "../controllers/reminders.controller.js";

const router = Router();

router.get("/", getReminders);
router.get("/:id", getReminderById);
router.post("/", createReminder);
router.put("/:id", updateReminder);
router.patch("/:id/done", markReminderDone);
router.delete("/:id", deleteReminder);

export default router;
