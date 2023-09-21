import { Plan } from '@chaban/db';
import { TRPCError } from '@trpc/server';
import { createMiddleware } from '../config/api';
import { env } from '../config/env';
import { Feature, featuresByPlans } from './features';

export const logger = createMiddleware(async (opts) => {
  const start = Date.now();
  const result = await opts.next();
  const durationMs = Date.now() - start;

  result.ok
    ? console.info('TRPC', opts.path, 'success -', durationMs, 'ms')
    : console.error('TRPC', opts.path, 'error -', durationMs, 'ms - -', result.error.message);

  return result;
});

export const isFeature = (...features: Feature[]) =>
  logger.unstable_pipe(async ({ next, ctx: { userId, plan } }) => {
    if (!plan) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'No access to this feature' });
    }

    if (!featuresByPlans[plan].some((f) => features.includes(f))) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'No access to this feature' });
    }
    return next({ ctx: { userId, plan } });
  });

export const isCron = logger.unstable_pipe(async ({ next, ctx: { cronSecretKey } }) => {
  if (!cronSecretKey || cronSecretKey !== env.CRON_SECRET) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Cron secret is invalid' });
  }

  return next({ ctx: {} });
});

export type ApiContext = {
  userId?: string;
  cronSecretKey?: string;
  plan?: Plan;
  host: string;
  domain: string;
};
