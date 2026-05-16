import { query } from "../config/db.js";

const getReminders = async (req, res, next) => {
    try {
        const userId = req.query.user_id;

        if (!userId) {
            return res.status(400).json({ message: "user_id is required" });
        }

        const result = await query(
            "select * from reminders where user_id = $1 order by reminder_date asc",
            [userId]
        );

        return res.json(result.rows);
    } catch (err) {
        return next(err);
    }
};

const getReminderById = async (req, res, next) => {
    try {
        const userId = req.query.user_id;
        const { id } = req.params;

        if (!userId) {
            return res.status(400).json({ message: "user_id is required" });
        }

        const result = await query(
            "select * from reminders where reminder_id = $1 and user_id = $2",
            [id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Reminder not found" });
        }

        return res.json(result.rows[0]);
    } catch (err) {
        return next(err);
    }
};

const createReminder = async (req, res, next) => {
    try {
        const {
            user_id: userId,
            application_id: applicationId,
            reminder_type: reminderType,
            reminder_date: reminderDate,
            message,
        } = req.body;

        // TODO: user_id should come from auth middleware/JWT.
        if (!userId || !applicationId || !reminderType || !reminderDate || !message) {
            return res.status(400).json({
                message:
                    "user_id, application_id, reminder_type, reminder_date, and message are required",
            });
        }

        const result = await query(
            "insert into reminders (user_id, application_id, reminder_type, reminder_date, message) values ($1, $2, $3, $4, $5) returning *",
            [userId, applicationId, reminderType, reminderDate, message]
        );

        return res.status(201).json(result.rows[0]);
    } catch (err) {
        return next(err);
    }
};

const updateReminder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const {
            user_id: userId,
            application_id: applicationId,
            reminder_type: reminderType,
            reminder_date: reminderDate,
            message,
            is_done: isDone,
        } = req.body;

        // TODO: user_id should come from auth middleware/JWT.
        if (!userId) {
            return res.status(400).json({ message: "user_id is required" });
        }

        const existingResult = await query(
            "select * from reminders where reminder_id = $1 and user_id = $2",
            [id, userId]
        );

        if (existingResult.rows.length === 0) {
            return res.status(404).json({ message: "Reminder not found" });
        }

        const existing = existingResult.rows[0];

        const result = await query(
            "update reminders set application_id = $1, reminder_type = $2, reminder_date = $3, message = $4, is_done = $5 where reminder_id = $6 and user_id = $7 returning *",
            [
                applicationId ?? existing.application_id,
                reminderType ?? existing.reminder_type,
                reminderDate ?? existing.reminder_date,
                message ?? existing.message,
                isDone ?? existing.is_done,
                id,
                userId,
            ]
        );

        return res.json(result.rows[0]);
    } catch (err) {
        return next(err);
    }
};

const markReminderDone = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.body.user_id || req.query.user_id;

        // TODO: user_id should come from auth middleware/JWT.
        if (!userId) {
            return res.status(400).json({ message: "user_id is required" });
        }

        const result = await query(
            "update reminders set is_done = true where reminder_id = $1 and user_id = $2 returning *",
            [id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Reminder not found" });
        }

        return res.json(result.rows[0]);
    } catch (err) {
        return next(err);
    }
};

const deleteReminder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.query.user_id;

        if (!userId) {
            return res.status(400).json({ message: "user_id is required" });
        }

        const result = await query(
            "delete from reminders where reminder_id = $1 and user_id = $2 returning *",
            [id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Reminder not found" });
        }

        return res.json({ message: "Reminder deleted" });
    } catch (err) {
        return next(err);
    }
};

export {
    getReminders,
    getReminderById,
    createReminder,
    updateReminder,
    markReminderDone,
    deleteReminder,
};
