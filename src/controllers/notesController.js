import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

export const getAllNotes = async (req, res) => {
  const notes = await Note.find();
  res.status(200).json({ notes: notes });
};

export const getNoteById = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findById(noteId);
  if (!note) throw createHttpError(404, 'The note not found');
  res.status(200).json({ note: note });
};

export const createNote = async (req, res) => {
  const note = req.body;
  const createdNote = await Note.create(note);
  res.status(201).json({ note: createdNote });
};

export const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findByIdAndDelete(noteId);
  if (!note) throw createHttpError(404, 'The note not found');
  res.status(200).json({ note: note });
};

export const updateNote = async (req, res) => {
  const { noteId } = req.params;
  const note = req.body;
  const updatedNote = await Note.findOneAndUpdate({ _id: noteId }, note, {
    returnDocument: 'after',
    runValidators: true,
  });
  if (!updatedNote) throw createHttpError(404, 'The note not found');
  res.status(200).json({ note: updatedNote });
};
