import createHttpError from 'http-errors';
import { noteModel } from '../models/note.js';

export const getAllNotes = async (req, res) => {
  const notes = await noteModel.find();
  res.status(200).json(notes);
};

export const getNoteById = async (req, res) => {
  const { noteId } = req.params;
  const note = await noteModel.findById(noteId);
  if (!note) throw createHttpError(404, 'The note not found');
  res.status(200).json(note);
};

export const createNote = (req, res) => {
  const note = req.body;
  console.log(note);
  res.status(201).json({ message: 'The note was created', note: note });
};

export const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const note = await noteModel.findByIdAndDelete(noteId);
  if (!note) throw createHttpError(404, 'The note not found');
  res.status(200).json({ message: 'The note was deleted', note });
};

export const updateNote = async (req, res) => {
  const note = req.body;
  const updatedNote = await noteModel.findOneAndUpdate(
    { _id: note._id },
    note,
    { returnDocument: 'after', runValidators: true },
  );
  if (!updateNote) throw createHttpError(404, 'The note not found');
  res.status(200).json({ message: 'The note was updated', note: updatedNote });
};
