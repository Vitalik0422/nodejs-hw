import createHttpError from 'http-errors';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { User } from '../models/user.js';

export const updateUserAvatar = async (req, res) => {
  const file = req.file;
  console.log(req.file);
  const user = req.user;
  console.log(file);
  if (!file) throw createHttpError(400, ' No file');
  const { secure_url } = await saveFileToCloudinary(file.buffer, user._id);
  await User.findOneAndUpdate(user._id, { avatar: secure_url });
  res.status(200).json({ url: secure_url });
};
