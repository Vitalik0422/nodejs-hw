import createHttpError from 'http-errors';
import handlebars from 'handlebars';
import jsonwebtoken from 'jsonwebtoken';
import { User } from '../models/user.js';
import { sendMail } from '../utils/sendMail.js';
import path from 'node:path';
import fs from 'node:fs/promises';
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
  const { sessionId, refreshToken } = req.cookies;
  const session = await Session.findOne({ _id: sessionId, refreshToken });

  if (!session) throw createHttpError(401, 'Session not found');

  if (Date.now() > session.refreshTokenValidUntil) {
    await Session.findByIdAndDelete(session._id);
    await clearSessionCookies(res);
    throw createHttpError(401, 'Session token expired');
  }

  await Session.findByIdAndDelete(session._id);
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

export const requestResetEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email });
  if (!user)
    res.status(200).json({ message: 'Password reset email successfully' });
  const url_token = jsonwebtoken.sign(
    { sub: user._id, email },
    process.env.JWT_SECRET,
    {
      expiresIn: '15min',
    },
  );
  const templatePath = path.resolve('src/templates/reset-password-email.html');
  const templateSource = await fs.readFile(templatePath, 'utf-8');
  const template = handlebars.compile(templateSource);
  const html = template({
    userName: user.username,
    resetLink: `${process.env.FRONTEND_DOMAIN}/auth/reset-password?token=${url_token}`,
    expiresIn: '15 хвилин',
  });

  try {
    await sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Reset your password',
      html,
    });
  } catch {
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }

  res.status(200).json({
    message: 'Password reset email sent successfully',
  });
};
export const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  const verifiedToken = jsonwebtoken.verify(
    token,
    process.env.JWT_SECRET,
    (err, verify) => {
      if (err) throw createHttpError(401, 'Invalid or expired token');
      return verify;
    },
  );
  const user = await User.findOne({
    _id: verifiedToken.sub,
    email: verifiedToken.email,
  });
  if (!user) throw createHttpError(404, 'User not found');
  const hashPassword = await bcrypt.hash(password, 10);
  await User.updateOne({ _id: user._id }, { password: hashPassword });

  res.status(200).json({ message: 'Password reset successfully' });
};
