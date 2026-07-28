import express from 'express';
import {
  loginUser,
  registerUser,
  refreshUserSession,
  logoutUser,
  requestResetEmail,
  resetPassword,
} from '../controllers/authController.js';
import { celebrate } from 'celebrate';
import {
  loginUserSchema,
  registerUserSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
} from '../validations/authValidation.js';

const auth = express.Router();

auth.post('/auth/register', celebrate(registerUserSchema), registerUser);
auth.post('/auth/login', celebrate(loginUserSchema), loginUser);
auth.post('/auth/refresh', refreshUserSession);
auth.post('/auth/logout', logoutUser);
auth.post(
  '/auth/request-reset-email',
  celebrate(requestResetEmailSchema),
  requestResetEmail,
);
auth.post(
  '/auth/reset-password',
  celebrate(resetPasswordSchema),
  resetPassword,
);

export default auth;
