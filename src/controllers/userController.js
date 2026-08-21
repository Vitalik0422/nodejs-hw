import createHttpError from 'http-errors';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { User } from '../models/user.js';

export const updateUserAvatar = async (req, res) => {
  const file = req.file;
  const user = req.user;
  if (!file) throw createHttpError(400, ' No file');
  const { secure_url } = await saveFileToCloudinary(file.buffer, user._id);
  await User.findOneAndUpdate(
    { _id: user._id },
    { avatar: secure_url },
    { returnDocument: 'after' },
  );
  res.status(200).json({ url: secure_url });
};
