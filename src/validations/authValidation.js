import { Joi, Segments } from 'celebrate';

const registerUserBodySchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.base': 'Email must be a string',
    'string.empty': 'Email cannot be empty',
    'string.email': 'Email must be a valid email address',
    'any.required': 'Email is required',
  }),

  password: Joi.string().min(8).max(100).required().messages({
    'string.base': 'Password must be a string',
    'string.empty': 'Password cannot be empty',
    'string.min': 'Password must be at least {#limit} characters long',
    'string.max': 'Password must not exceed {#limit} characters',
    'any.required': 'Password is required',
  }),
});

const loginUserBodySchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.base': 'Email must be a string',
    'string.empty': 'Email cannot be empty',
    'string.email': 'Email must be a valid email address',
    'any.required': 'Email is required',
  }),

  password: Joi.string().max(100).required().messages({
    'string.base': 'Password must be a string',
    'string.empty': 'Password cannot be empty',
    'string.max': 'Password must not exceed {#limit} characters',
    'any.required': 'Password is required',
  }),
});

const requestResetEmailBodySchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.base': 'Email must be a string',
    'string.empty': 'Email cannot be empty',

    'string.email': 'Email must be a valid email address',
    'any.required': 'Email is required',
  }),
});

export const registerUserSchema = { [Segments.BODY]: registerUserBodySchema };
export const loginUserSchema = { [Segments.BODY]: loginUserBodySchema };
export const requestResetEmailSchema = {
  [Segments.BODY]: requestResetEmailBodySchema,
};
