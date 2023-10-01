import { createRouter } from '../../config/api';
import { createNotificationRule } from './createNotificationRule';
import { deleteNotificationRule } from './deleteNotificationRule';
import { getNotificationRules } from './getNotificationRules';
import { isSubscribedFromChabanWithoutAuth } from './isSubscribedFromChabanWithoutAuth';
import { sendNotifications } from './sendNotifications';
import { subscribeToChabanWithoutAuth } from './subscribeToChabanWithoutAuth';
import { toggleNotificationRule } from './toggleNotificationRule';
import { unsubscribeFromChabanWithoutAuth } from './unsubscribeFromChabanWithoutAuth';
import { updateNotificationRule } from './updateNotificationRule';

export const notificationRule = createRouter({
  createNotificationRule,
  deleteNotificationRule,
  updateNotificationRule,
  toggleNotificationRule,
  getNotificationRules,
});

export const chabanSubscriptions = createRouter({
  subscribeToChabanWithoutAuth,
  unsubscribeFromChabanWithoutAuth,
  isSubscribedFromChabanWithoutAuth,
});

export const notifications = createRouter({
  sendNotifications,
});
