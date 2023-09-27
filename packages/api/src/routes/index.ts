import { createRouter } from '../config/api';
import { alert } from './alert';
import { ApiContext } from './context';
import { chabanSubscriptions, notificationRule, notifications } from './notification';

export const apiRouter = createRouter({
  alert,
  chabanSubscriptions,
  notificationRule,
  notifications,
});
export type ApiRouter = typeof apiRouter;

export type { ApiContext };
