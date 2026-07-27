import express from 'express';
import {
  loginUser,
  registerUser,
  refreshUserSession,
  logoutUser,
} from '../controllers/authController.js';
import { celebrate } from 'celebrate';
import {
  loginUserSchema,
  registerUserSchema,
} from '../validations/authValidation.js';

const auth = express.Router();

auth.post('/auth/register', celebrate(registerUserSchema), registerUser);
auth.post('/auth/login', celebrate(loginUserSchema), loginUser);
auth.post('/auth/refresh', refreshUserSession);
auth.post('/auth/logout', logoutUser);

export default auth;
