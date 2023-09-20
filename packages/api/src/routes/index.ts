import * as trpcExpress from '@trpc/server/adapters/express';
import { createRouter } from '../config/api';
import { alert } from './alert';
import { ApiContext, apiContextMiddleware, createContext } from './context';
import { chabanSubscriptions, notificationRule, notifications } from './notification';

export const apiRouter = createRouter({
  alert,
  chabanSubscriptions,
  notificationRule,
  notifications,
});
export type ApiRouter = typeof apiRouter;
export const expressMiddleware = trpcExpress.createExpressMiddleware({
  router: apiRouter,
  createContext,
});

export { apiContextMiddleware };
export type { ApiContext };
