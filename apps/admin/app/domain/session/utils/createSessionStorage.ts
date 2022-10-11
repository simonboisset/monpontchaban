import { createCookieSessionStorage } from '@remix-run/node';
import { config } from '~/domain/config.server';

export const createSessionStorage = () => {
  const { SESSION_SECRET } = config();
  return createCookieSessionStorage({
    cookie: {
      name: '__session',
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
      sameSite: 'lax',
      secrets: [SESSION_SECRET],
      secure: process.env.NODE_ENV === 'production',
    },
  });
};
