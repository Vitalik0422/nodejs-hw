import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import bcrypt from 'bcrypt';
import {
  createSession,
  setSessionCookies,
  clearSessionCookies,
} from '../services/auth.js';
import { Session } from '../models/session.js';

export const registerUser = async (req, res) => {
  const { email, password } = req.body;
  const checkEmail = await User.findOne({ email: email });
  if (checkEmail) throw createHttpError(400, 'Email in use');

  const hashPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashPassword });
  const session = await createSession(user._id);
  await setSessionCookies(res, session);
  return res.status(201).json(user);
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) throw createHttpError(401, 'Invalid credentials');
  const comparePassword = await bcrypt.compare(password, user.password);
  if (!comparePassword) throw createHttpError(401, 'Invalid credentials');
  await Session.deleteOne({ userId: user._id });
  const session = await createSession(user._id);
  await setSessionCookies(res, session);
  return res.status(200).json(user);
};

export const refreshUserSession = async (req, res) => {
  const sessionId = await req.cookies.sessionId;
  const refreshToken = await req.cookies.refreshToken;
  const session = await Session.find({ sessionId, refreshToken });

  if (!session) throw createHttpError(401, 'Session not found');
  if (Date.now() > session.refreshTokenValidUntil) {
    await Session.findByIdAndDelete(sessionId);
    await clearSessionCookies(res);
    throw createHttpError(401, 'Session token expired');
  }
  await Session.findByIdAndDelete(sessionId);
  const newSession = await createSession(session.userId);
  await setSessionCookies(res, newSession);
  res.status(200).json({ message: 'Session refreshed' });
};

export const logoutUser = async (req, res) => {
  const sessionId = req.cookies.sessionId;
  if (sessionId) await Session.findByIdAndDelete(sessionId);
  clearSessionCookies(res);
  res.status(204).json();
};
