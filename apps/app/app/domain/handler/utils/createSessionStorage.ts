import { createCookieSessionStorage } from '@remix-run/node';
import { getConfig } from '~/domain/config/getConfig';

export const createSessionStorage = () => {
  const { SESSION_SECRET } = getConfig();
  return createCookieSessionStorage({
    cookie: {
      name: '__session',
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
      sameSite: 'lax',
      secrets: [SESSION_SECRET],
      secure: process.env.NODE_ENV === 'production',
    },
  });
};
