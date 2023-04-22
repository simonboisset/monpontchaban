import { createRouter } from '../../config/api';
import { createNotificationRule } from './createNotificationRule';
import { deleteNotificationRule } from './deleteNotificationRule';
import { isSubscribedFromChabanWithoutAuth } from './isSubscribedFromChabanWithoutAuth';
import { sendNotifications } from './sendNotifications';
import { subscribeToChabanWithoutAuth } from './subscribeToChabanWithoutAuth';
import { unsubscribeFromChabanWithoutAuth } from './unsubscribeFromChabanWithoutAuth';
import { updateNotificationRule } from './updateNotificationRule';

export const notificationRule = createRouter({
  createNotificationRule,
  deleteNotificationRule,
  updateNotificationRule,
});

export const chabanSubscriptions = createRouter({
  subscribeToChabanWithoutAuth,
  unsubscribeFromChabanWithoutAuth,
  isSubscribedFromChabanWithoutAuth,
});

export const notifications = createRouter({
  sendNotifications,
});
