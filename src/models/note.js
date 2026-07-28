import { TAGS } from '../constants/tags.js';
import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, trim: true, default: '' },
    tag: {
      type: String,
      enum: TAGS,
    },
  },
  { timestamps: true },
);

schema.index({ tag: 1 });

export const Note = mongoose.model('Note', schema);
