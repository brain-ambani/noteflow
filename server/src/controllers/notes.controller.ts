import { db } from "@/db/db";
import { Request, Response } from "express";

// Create a new note
export async function createNote(req: Request, res: Response) {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      res.status(400).json({ error: "Title and content are required" });
      return;
    }

    const note = await db.note.create({
      data: {
        title,
        content,
      },
    });

    res.status(201).json(note);
    return;
  } catch (error) {
    console.error(error);
  }
}

// Get all notes
export async function getNotes(req: Request, res: Response) {
  try {
    const notes = await db.note.findMany();

    res.status(200).json(notes);
    return;
  } catch (error) {
    console.error(error);
  }
}
