import jwt from 'jsonwebtoken';
import { USER_SESSION_KEY } from './login';
import { createSessionStorage } from './utils/createSessionStorage';

export const isAuthenticated = async (request: Request) => {
  const JWT_TOKEN = process.env.JWT_TOKEN;
  if (!JWT_TOKEN) {
    throw new Error('JWT_TOKEN must be set');
  }
  const cookie = request.headers.get('Cookie');
  const session = await createSessionStorage().getSession(cookie);

  const token = session.get(USER_SESSION_KEY);
  if (!token) {
    return false;
  }
  try {
    jwt.verify(token, JWT_TOKEN);
    return true;
  } catch (error) {
    return false;
  }
};
