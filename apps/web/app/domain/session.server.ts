import { env } from '@chaban/api';
import { createCookieSessionStorage, redirect } from '@remix-run/node';
import z, { ZodType } from 'zod';
import { ToastProps } from '~/ui/toast';

type SessionName = '__session' | 'flash' | 'onboarding' | 'resetPassword';

type SessionFactoryParams = {
  name: SessionName;
  maxAge?: number;
};

const sessionFactory = <O>({ name, maxAge }: SessionFactoryParams, schema: ZodType<O>) => {
  const store = createCookieSessionStorage({
    cookie: {
      name,
      httpOnly: true,
      maxAge,
      path: '/',
      sameSite: 'lax',
      secrets: [env.SESSION_SECRET],
      secure: env.NODE_ENV === 'production',
    },
  });
  const get = async (headers: Headers) => {
    const cookie = headers.get('Cookie');
    const session = await store.getSession(cookie);
    const sessionValue = session.get(name);

    const validatedSessionObject = schema.safeParse(sessionValue);
    if (!validatedSessionObject.success) {
      return null;
    }

    return validatedSessionObject.data;
  };

  const require = async (headers: Headers, redirectTo?: string) => {
    const token = await get(headers);
    if (!token) {
      throw redirect(redirectTo || '/');
    }

    return token;
  };

  const requireTokenNull = async (headers: Headers, redirectTo?: string) => {
    const token = await get(headers);

    if (token) {
      throw redirect(redirectTo || '/');
    }
    return null;
  };

  const create = async (headers: Headers, value: O) => {
    const cookie = headers.get('Cookie');

    const validatedSessionObject = schema.parse(value);
    const session = await store.getSession(cookie);

    session.set(name, validatedSessionObject);
    const nextHeaders = new Headers({
      'Set-Cookie': await store.commitSession(session),
    });
    return { headers: nextHeaders };
  };

  const remove = async (headers: Headers) => {
    const cookie = headers.get('Cookie');
    const session = await store.getSession(cookie);
    const nextHeaders = new Headers({
      'Set-Cookie': await store.destroySession(session),
    });
    return { headers: nextHeaders };
  };

  const flash = async (headers: Headers, value: O) => {
    const cookie = headers.get('Cookie');
    const session = await store.getSession(cookie);
    const validatedSessionObject = schema.parse(value);

    session.flash(name, validatedSessionObject);
    const nextHeaders = new Headers({
      'Set-Cookie': await store.commitSession(session),
    });
    return { headers: nextHeaders };
  };

  const getFlash = async (headers: Headers) => {
    const cookie = headers.get('Cookie');
    const session = await store.getSession(cookie);

    const sessionObject = session.get(name);

    const validatedSessionObject = schema.safeParse(sessionObject);
    const flashheaders = new Headers({
      'Set-Cookie': await store.commitSession(session),
    });
    if (!validatedSessionObject.success) {
      return { flash: null, headers: flashheaders };
    }

    return { flash: validatedSessionObject.data, headers: flashheaders };
  };

  return { get, require, create, requireTokenNull, remove, flash, getFlash };
};

const toastMessageSchema = z.object({
  title: z.string(),
  variant: z.custom<ToastProps['variant']>().optional(),
  description: z.string().optional(),
});

const flashSessionValuesSchema = z.object({
  confetti: z.string().optional(),
  toast: toastMessageSchema.optional(),
});
export type ToastMessage = z.infer<typeof toastMessageSchema>;

export const sessionService = {
  auth: sessionFactory({ name: '__session', maxAge: 60 * 60 * 24 * 30 }, z.object({ token: z.string() })),
  flash: sessionFactory({ name: 'flash' }, flashSessionValuesSchema),
  onboarding: sessionFactory({ name: 'onboarding' }, z.object({ token: z.string() })),
  resetPassword: sessionFactory({ name: 'resetPassword' }, z.object({ token: z.string() })),
};
