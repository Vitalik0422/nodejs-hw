import express from 'express';
import {
  createNote,
  deleteNote,
  getAllNotes,
  getNoteById,
  updateNote,
} from '../controllers/notesController.js';

const notes = express.Router();

notes.get('/notes', getAllNotes);
notes.get('/notes/:noteId', getNoteById);
notes.post('/notes', createNote);
notes.patch('/notes', updateNote);
notes.delete('/notes/:noteId', deleteNote);

export default notes;
