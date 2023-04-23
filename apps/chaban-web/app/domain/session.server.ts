import { env } from '@lezo-alert/api';
import { createCookieSessionStorage, json, redirect } from '@remix-run/node';
import z from 'zod';
export const USER_SESSION_KEY = 'karl-auth-token';

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__session',
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
    sameSite: 'lax',
    secrets: [env.SESSION_SECRET],
    secure: env.NODE_ENV === 'production',
  },
});

const get = async (request: Request) => {
  const cookie = request.headers.get('Cookie');
  const session = await sessionStorage.getSession(cookie);
  const token = z
    .string()
    .nullable()
    .parse(session.get(USER_SESSION_KEY) || null);

  return token;
};

const require = async (request: Request, redirectTo?: string) => {
  const token = await get(request);
  if (!token) {
    throw redirect(redirectTo || '/');
  }

  return token;
};

const requireTokenNull = async (request: Request, redirectTo?: string) => {
  const token = await get(request);

  if (token) {
    throw redirect(redirectTo || '/');
  }
  return null;
};

const create = async <R extends string | undefined = undefined>({
  request,
  token,
  redirectTo,
}: {
  request: Request;
  token: string;
  redirectTo?: R;
}): Promise<R extends string ? never : {}> => {
  const cookie = request.headers.get('Cookie');
  const session = await sessionStorage.getSession(cookie);

  session.set(USER_SESSION_KEY, token);

  if (redirectTo) {
    //@ts-ignore
    return redirect(redirectTo, {
      headers: {
        'Set-Cookie': await sessionStorage.commitSession(session),
      },
    });
  }
  //@ts-ignore
  return json(
    {},
    {
      headers: {
        'Set-Cookie': await sessionStorage.commitSession(session),
      },
    },
  );
};

const remove = async (request: Request) => {
  const cookie = request.headers.get('Cookie');
  const session = await sessionStorage.getSession(cookie);

  return redirect('/', {
    headers: {
      'Set-Cookie': await sessionStorage.destroySession(session),
    },
  });
};

export const sessionService = {
  get,
  require,
  requireTokenNull,
  create,
  remove,
};
