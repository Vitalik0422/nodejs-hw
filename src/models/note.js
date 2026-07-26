import { TAGS } from '../constants/tags.js';
import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: false, trim: true, default: '' },
    tag: {
      type: String,
      enum: TAGS,
      default: 'Todo',
      required: false,
    },
  },
  { timestamps: true },
);

export const noteModel = mongoose.model('Note', schema);
