import { TAGS } from '../constants/tags.js';
import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    title: { type: String, require: true, trim: true },
    content: { type: String, require: false, trim: true, default: '' },
    tag: {
      type: String,
      enum: TAGS,
      default: 'Todo',
      require: false,
    },
  },
  { timestamps: true },
);

export const noteModel = mongoose.model('Note', schema);
