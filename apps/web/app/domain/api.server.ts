import { ApiContext, apiRouter, env, services } from '@chaban/api';
import { DataFunctionArgs } from '@remix-run/node';
import { FetchCreateContextFnOptions, fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { sessionService } from './session.server';
export const remixServices = services;

export const remixEnv = env;

const createFetcherContext = ({ req }: FetchCreateContextFnOptions): ApiContext => {
  const token = req.headers.get('authorization')?.replace('Bearer ', '') || null;
  const cronSecretKey = req.headers.get('x-cron-secret-key') || undefined;
  const host = req.headers.get('host') || '';
  const domainProtocol = host === 'localhost:3000' ? 'http' : 'https';
  const domain = `${domainProtocol}://${host}`;

  if (!token || typeof token !== 'string') {
    return { domain, host, cronSecretKey };
  }

  const { userId, expiresAt, plan } = services.token.auth.verify(token);
  if (services.token.isExpired(expiresAt)) {
    return { domain, host, cronSecretKey };
  }

  return { domain, host, userId, cronSecretKey, plan };
};

export const remixAdapteur = async (headers: Headers): Promise<ApiContext> => {
  const sessionToken = await sessionService.auth.get(headers);
  const token = sessionToken?.token;
  const cronSecretKey = headers.get('x-cron-secret-key') || undefined;

  const host = headers.get('host') || '';
  const domainProtocol = host === 'localhost:3000' ? 'http' : 'https';
  const domain = `${domainProtocol}://${host}`;

  if (!token || typeof token !== 'string') {
    return { domain, host, cronSecretKey };
  }

  const { userId, expiresAt, plan } = services.token.auth.verify(token);
  if (services.token.isExpired(expiresAt)) {
    return { domain, host, cronSecretKey };
  }

  return { domain, host, userId, cronSecretKey, plan };
};

export const remixCaller = async (headers: Headers) => {
  const ctx = await remixAdapteur(headers);
  return apiRouter.createCaller(ctx);
};

export const handleRequest = async (args: DataFunctionArgs) => {
  return fetchRequestHandler({
    endpoint: '/api',
    req: args.request,
    router: apiRouter,
    createContext: createFetcherContext,
  });
};
