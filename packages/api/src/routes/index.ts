import * as trpcExpress from '@trpc/server/adapters/express';
import { createRouter } from '../config/api';
import { deleteUser, devices } from './account';
import { alert } from './alert';
import { authenticationCode } from './authenticationCode';
import { ApiContext, apiContextMiddleware, createContext } from './context';
import { chabanSubscriptions, notificationRule, notifications } from './notification';
import { supportIssues, supportMessages } from './support';

export const apiRouter = createRouter({
  devices,
  deleteUser,
  authenticationCode,
  alert,
  chabanSubscriptions,
  notificationRule,
  notifications,
  supportIssues,
  supportMessages,
});
export type ApiRouter = typeof apiRouter;
export const expressMiddleware = trpcExpress.createExpressMiddleware({
  router: apiRouter,
  createContext,
});

export { ApiContext, apiContextMiddleware };
