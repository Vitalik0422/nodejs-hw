import createHttpError from 'http-errors';
import { Session } from '../models/session.js';
import { User } from '../models/user.js';

export const authenticate = async (req, res, next) => {
  const { accessToken, sessionId } = req.cookies;
  if (!sessionId || !refreshToken) {
    throw createHttpError(401, 'Missing session credentials');
  }
  const session = await Session.findOne({
    _id: sessionId,
    refreshToken,
  });
  if (!session) throw createHttpError(401, 'Session not found');
  if (Date.now() > session.accessTokenValidUntil)
    throw createHttpError(401, 'Access token expired');
  const user = await User.findById(session.userId);
  if (!user) throw createHttpError(401);
  req.user = user;
  next();
};
