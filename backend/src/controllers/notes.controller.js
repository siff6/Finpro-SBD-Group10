import { query } from "../config/db.js";

const getNotesByApplication = async (req, res, next) => {
    try {
        const userId = req.query.user_id;
        const { application_id: applicationId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: "user_id is required" });
        }

        const result = await query(
            "select * from application_notes where application_id = $1 and user_id = $2 order by created_at desc",
            [applicationId, userId]
        );

        return res.json(result.rows);
    } catch (err) {
        return next(err);
    }
};

const createNote = async (req, res, next) => {
    try {
        const { application_id: applicationId } = req.params;
        const { user_id: userId, note } = req.body;

        // TODO: user_id should come from auth middleware/JWT.
        if (!userId || !note) {
            return res.status(400).json({ message: "user_id and note are required" });
        }

        const result = await query(
            "insert into application_notes (application_id, user_id, note) values ($1, $2, $3) returning *",
            [applicationId, userId, note]
        );

        return res.status(201).json(result.rows[0]);
    } catch (err) {
        return next(err);
    }
};

const updateNote = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { user_id: userId, note } = req.body;

        // TODO: user_id should come from auth middleware/JWT.
        if (!userId || !note) {
            return res.status(400).json({ message: "user_id and note are required" });
        }

        const result = await query(
            "update application_notes set note = $1 where note_id = $2 and user_id = $3 returning *",
            [note, id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Note not found" });
        }

        return res.json(result.rows[0]);
    } catch (err) {
        return next(err);
    }
};

const deleteNote = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.query.user_id;

        if (!userId) {
            return res.status(400).json({ message: "user_id is required" });
        }

        const result = await query(
            "delete from application_notes where note_id = $1 and user_id = $2 returning *",
            [id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Note not found" });
        }

        return res.json({ message: "Note deleted" });
    } catch (err) {
        return next(err);
    }
};

export { getNotesByApplication, createNote, updateNote, deleteNote };
