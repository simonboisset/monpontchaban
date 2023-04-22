import { TRPCError, inferAsyncReturnType } from '@trpc/server';
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { z } from 'zod';
import { createMiddleware } from '../config/api';
import { env } from '../config/env';
import { services } from '../services';

type ApiContextParams = {
  token: string | null;
  cronSecretKey: string | null;
};

export const apiContextMiddleware = ({ token, cronSecretKey }: ApiContextParams) => {
  const { userId, isAdmin, createdAt } = token
    ? services.token.auth.verify(token)
    : { userId: null, isAdmin: false, createdAt: null };
  return { userId, cronSecretKey, isAdmin, createdAt };
};

export const isAuth = createMiddleware(async ({ next, ctx: { userId } }) => {
  if (!userId) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User is not authenticated' });
  }
  return next({ ctx: { userId: userId } });
});

export const isCron = createMiddleware(async ({ next, ctx: { cronSecretKey } }) => {
  if (env.CRON_SECRET !== cronSecretKey) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Cron secret key is invalid' });
  }

  return next({ ctx: { cronSecretKey } });
});

export const isAdmin = createMiddleware(async ({ next, ctx: { userId, isAdmin } }) => {
  if (userId === null) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User is not defined' });
  }

  if (!isAdmin) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User is not admin' });
  }
  return next({ ctx: { userId } });
});

export const createContext = ({ req }: CreateExpressContextOptions): ApiContext => {
  const token = z.string().optional().parse(req.headers.authorization?.replace('Bearer ', '')) || null;
  const cronSecretKey = z.string().optional().parse(req.headers['x-cron-secret-key']) || null;
  const ctx = apiContextMiddleware({ cronSecretKey, token });
  return ctx;
};

export type ApiContext = inferAsyncReturnType<typeof apiContextMiddleware>;
