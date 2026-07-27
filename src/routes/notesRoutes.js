import express from 'express';
import { celebrate } from 'celebrate';
import {
  getAllNotesSchema,
  noteIdSchema,
  createNoteSchema,
  updateNoteSchema,
} from '../validations/notesValidation.js';
import {
  createNote,
  deleteNote,
  getAllNotes,
  getNoteById,
  updateNote,
} from '../controllers/notesController.js';

const notes = express.Router();

notes.get('/notes', celebrate(getAllNotesSchema), getAllNotes);
notes.get('/notes/:noteId', celebrate(noteIdSchema), getNoteById);
notes.post('/notes', celebrate(createNoteSchema), createNote);
notes.patch('/notes/:noteId', celebrate(updateNoteSchema), updateNote);
notes.delete('/notes/:noteId', celebrate(noteIdSchema), deleteNote);

export default notes;
