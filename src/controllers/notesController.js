import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

export const getAllNotes = async (req, res) => {
  const { page = 1, perPage = 10, search, tag } = req.query;
  const filter = {};

  if (search)
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
    ];

  if (tag) filter.tag = tag;
  const skip = (page - 1) * perPage;
  const [totalNotes, notes] = await Promise.all([
    Note.find(filter).clone().countDocuments(),
    Note.find(filter).skip(skip).limit(perPage),
  ]);
  const totalPages = Math.ceil(totalNotes / perPage);

  res.status(200).json({ notes, page, perPage, totalNotes, totalPages });
};

export const getNoteById = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findById(noteId);
  if (!note) throw createHttpError(404, 'The note not found');
  res.status(200).json({ note });
};

export const createNote = async (req, res) => {
  const note = req.body;
  const createdNote = await Note.create(note);
  res.status(201).json({ createdNote });
};

export const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findByIdAndDelete(noteId);
  if (!note) throw createHttpError(404, 'The note not found');
  res.status(200).json({ note });
};

export const updateNote = async (req, res) => {
  const { noteId } = req.params;
  const note = req.body;
  const updatedNote = await Note.findOneAndUpdate({ _id: noteId }, note, {
    returnDocument: 'after',
    runValidators: true,
  });
  if (!updatedNote) throw createHttpError(404, 'The note not found');
  res.status(200).json({ updatedNote });
};
