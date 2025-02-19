import { createNote, getNotes } from "@/controllers/notes.controller";
import express from "express";

const notesRouter = express.Router();

notesRouter.get("/", getNotes);
notesRouter.post("/create", createNote);

export default notesRouter;
