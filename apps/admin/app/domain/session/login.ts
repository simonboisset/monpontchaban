import jwt from 'jsonwebtoken';
import { createSessionStorage } from './utils/createSessionStorage';
export const USER_SESSION_KEY = 'auth-token';

export const login = async (request: Request, username: string, password: string) => {
  const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
  if (!ADMIN_USERNAME) {
    throw new Error('[Login] ADMIN_USERNAME must be set');
  }
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  if (!ADMIN_PASSWORD) {
    throw new Error('[Login] ADMIN_PASSWORD must be set');
  }
  const JWT_TOKEN = process.env.JWT_TOKEN;
  if (!JWT_TOKEN) {
    throw new Error('JWT_TOKEN must be set');
  }

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    throw new Error('[Login] Invalid username or password');
  }
  const cookie = request.headers.get('Cookie');
  const sessionStore = createSessionStorage();
  const session = await sessionStore.getSession(cookie);

  const token = jwt.sign({ admin: true }, JWT_TOKEN);
  session.set(USER_SESSION_KEY, token);
  const nextCookie = await sessionStore.commitSession(session);
  return { headers: { 'Set-Cookie': nextCookie } };
};
