import { ApiContext, apiContextMiddleware, apiRouter, env, services } from '@lezo-alert/api';
import { ActionArgs, LoaderArgs } from '@remix-run/node';
import { FetchCreateContextFnOptions, fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { sessionService } from './session.server';
export const remixServices = services;

export const remixEnv = env;

const createFetcherContext = ({ req }: FetchCreateContextFnOptions) => {
  const token = req.headers.get('authorization')?.replace('Bearer ', '') || null;
  const cronSecretKey = req.headers.get('x-cron-secret-key');
  const ctx = apiContextMiddleware({ token, cronSecretKey });
  return ctx;
};

export const remixAdapteur = async (args: LoaderArgs | ActionArgs): Promise<ApiContext> => {
  const token = await sessionService.get(args.request);
  const cronSecretKey = args.request.headers.get('x-cron-secret-key');

  const ctx = apiContextMiddleware({ token, cronSecretKey });
  return ctx;
};

export const remixCaller = async (args: LoaderArgs | ActionArgs) => {
  const ctx = await remixAdapteur(args);
  return apiRouter.createCaller(ctx);
};

export const handleRequest = async (args: LoaderArgs | ActionArgs) => {
  return fetchRequestHandler({
    endpoint: '/api',
    req: args.request,
    router: apiRouter,
    createContext: createFetcherContext,
  });
};
