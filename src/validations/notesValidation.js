import { Joi, Segments } from 'celebrate';
import { TAGS } from '../constants/tags.js';
import { isValidObjectId } from 'mongoose';

const getNotesQuerySchema = Joi.object({
  search: Joi.string().allow('').messages({
    'string.base': 'Search must be a string',
    'string.min': 'Search must be at least {#limit} character long',
    'string.max': 'Search must not exceed {#limit} characters',
  }),

  tag: Joi.string()
    .valid(...TAGS)
    .messages({
      'any.only': `Tag must be one of: ${TAGS.join(', ')}`,
      'string.base': 'Tag must be a string',
    }),

  page: Joi.number().positive().min(1).default(1).messages({
    'number.base': 'Page must be a number',
    'number.positive': 'Page must be a positive number',
    'number.min': 'Page must be at least {#limit}',
  }),

  perPage: Joi.number().positive().min(5).max(20).default(10).messages({
    'number.base': 'Per page must be a number',
    'number.positive': 'Per page must be a positive number',
    'number.min': 'Per page must be at least {#limit}',
    'number.max': 'Per page must not exceed {#limit}',
  }),
});

const createNoteBodySchema = Joi.object({
  title: Joi.string().min(1).max(100).required().messages({
    'string.base': 'Title must be a string',
    'string.empty': 'Title cannot be empty',
    'string.min': 'Title must be at least {#limit} character long',
    'string.max': 'Title must not exceed {#limit} characters',
    'any.required': 'Title is required',
  }),

  content: Joi.string().allow('').max(1000).messages({
    'string.base': 'Content must be a string',
    'string.max': 'Content must not exceed {#limit} characters',
  }),

  tag: Joi.string()
    .valid(...TAGS)
    .messages({
      'any.only': `Tag must be one of: ${TAGS.join(', ')}`,
      'string.base': 'Tag must be a string',
    }),
});

const objectValidator = (value, helpers) =>
  isValidObjectId(value) ? value : helpers.message('Invalid id format');

const noteIdParamsSchema = Joi.object({
  noteId: Joi.string().custom(objectValidator).required(),
});

const updateNoteBodySchema = Joi.object({
  title: Joi.string().min(1).max(100).messages({
    'string.base': 'Title must be a string',
    'string.empty': 'Title cannot be empty',
    'string.min': 'Title must be at least {#limit} character long',
    'string.max': 'Title must not exceed {#limit} characters',
  }),

  content: Joi.string().max(1000).allow('').messages({
    'string.base': 'Content must be a string',
    'string.max': 'Content must not exceed {#limit} characters',
  }),

  tag: Joi.string()
    .valid(...TAGS)
    .messages({
      'any.only': `Tag must be one of: ${TAGS.join(', ')}`,
      'string.base': 'Tag must be a string',
    }),
})
  .min(1)
  .messages({
    'object.min': 'At least one field must be provided to update',
  });

export const getAllNotesSchema = { [Segments.QUERY]: getNotesQuerySchema };
export const noteIdSchema = { [Segments.PARAMS]: noteIdParamsSchema };
export const createNoteSchema = { [Segments.BODY]: createNoteBodySchema };
export const updateNoteSchema = {
  [Segments.PARAMS]: noteIdParamsSchema,
  [Segments.BODY]: updateNoteBodySchema,
};
