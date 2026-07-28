import express from 'express';
import { upload } from '../middleware/multer.js';
import { updateUserAvatar } from '../controllers/userController.js';

const users = express.Router();

users.post('/users/me/avatar', upload.single('avatar'), updateUserAvatar);

export default users;
