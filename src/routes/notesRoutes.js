import express from 'express';
import { celebrate } from 'celebrate';
import {
  getNotesSchema,
  noteIdSchema,
  createNotesSchema,
  updateNoteSchema,
} from '../validations/notesValidations.js';
import {
  createNote,
  deleteNote,
  getAllNotes,
  getNoteById,
  updateNote,
} from '../controllers/notesController.js';

const notes = express.Router();

notes.get('/notes', celebrate(getNotesSchema), getAllNotes);
notes.get('/notes/:noteId', celebrate(noteIdSchema), getNoteById);
notes.post('/notes', celebrate(createNotesSchema), createNote);
notes.patch('/notes/:noteId', celebrate(updateNoteSchema), updateNote);
notes.delete('/notes/:noteId', celebrate(noteIdSchema), deleteNote);

export default notes;
