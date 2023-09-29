import { TRPCError } from '@trpc/server';
import { createMiddleware } from '../config/api';
import { env } from '../config/env';

export const logger = createMiddleware(async (opts) => {
  const start = Date.now();
  const result = await opts.next();
  const durationMs = Date.now() - start;

  result.ok
    ? console.info('TRPC', opts.path, 'success -', durationMs, 'ms')
    : console.error('TRPC', opts.path, 'error -', durationMs, 'ms - -', result.error.message);

  return result;
});

export const isRegistered = logger.unstable_pipe(async ({ next, ctx: { deviceId } }) => {
  if (!deviceId) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'No access to this feature' });
  }

  return next({ ctx: { deviceId } });
});

export const isCron = logger.unstable_pipe(async ({ next, ctx: { cronSecretKey } }) => {
  if (!cronSecretKey || cronSecretKey !== env.CRON_SECRET) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Cron secret is invalid' });
  }

  return next({ ctx: {} });
});

export type ApiContext = {
  deviceId?: string;
  sessionId?: string;
  cronSecretKey?: string;
  host: string;
  domain: string;
};
