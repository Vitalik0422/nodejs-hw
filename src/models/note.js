import { TAGS } from '../constants/tags.js';
import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, trim: true, default: '' },
    tag: {
      type: String,
      enum: TAGS,
      index: true,
      default: 'Todo',
    },
  },
  { timestamps: true },
);

export const Note = mongoose.model('Note', schema);
