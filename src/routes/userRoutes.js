import express from 'express';
import { upload } from '../middleware/multer.js';
import { updateUserAvatar } from '../controllers/userController.js';
import { authenticate } from '../middleware/authenticate.js';

const users = express.Router();

users.post(
  '/users/me/avatar',
  authenticate,
  upload.single('avatar'),
  updateUserAvatar,
);

export default users;
