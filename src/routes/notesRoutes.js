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
import { authenticate } from '../middleware/authenticate.js';

const notes = express.Router();

notes.get('/notes', authenticate, celebrate(getAllNotesSchema), getAllNotes);
notes.get('/notes/:noteId', authenticate, celebrate(noteIdSchema), getNoteById);
notes.post('/notes', authenticate, celebrate(createNoteSchema), createNote);
notes.patch(
  '/notes/:noteId',
  authenticate,
  celebrate(updateNoteSchema),
  updateNote,
);
notes.delete(
  '/notes/:noteId',
  authenticate,
  celebrate(noteIdSchema),
  deleteNote,
);

export default notes;
