import { Router } from "express";
import {
    getNotesByApplication,
    createNote,
    updateNote,
    deleteNote,
} from "../controllers/notes.controller.js";

const router = Router();

router.get("/applications/:application_id/notes", getNotesByApplication);
router.post("/applications/:application_id/notes", createNote);
router.put("/notes/:id", updateNote);
router.delete("/notes/:id", deleteNote);

export default router;
