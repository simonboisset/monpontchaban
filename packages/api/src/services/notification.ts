import type { ExpoPushMessage, ExpoPushTicket, ExpoPushToken } from 'expo-server-sdk';
import Expo from 'expo-server-sdk';
import { env } from '../config/env';

type SendNotificationParams = {
  tokens: ExpoPushToken[];
  title?: string;
  subtitle?: string;
  message?: string;
  priority?: 'default' | 'normal' | 'high';
  badge?: number;
  data?: Record<string, string>;
};
const send = async ({ message, title, tokens, badge, priority, data, subtitle }: SendNotificationParams) => {
  let expo = new Expo({ accessToken: env.EXPO_ACCESS_TOKEN });
  let messages: ExpoPushMessage[] = [];
  let wrongTokensCount = 0;
  for (let pushToken of tokens) {
    if (!Expo.isExpoPushToken(pushToken)) {
      wrongTokensCount++;
      continue;
    }
    messages.push({ to: pushToken, sound: 'default', title, body: message, priority, badge, data, subtitle });
  }

  let chunks = expo.chunkPushNotifications(messages);
  let tickets: ExpoPushTicket[] = [];
  let sendErrorCount = 0;
  for (let chunk of chunks) {
    try {
      let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    } catch (error) {
      sendErrorCount++;
    }
  }

  sendErrorCount += tickets.map((t) => t.status).filter((s) => s !== 'ok').length;

  console.info(`Expo notifications send errors: ${sendErrorCount}, wrong tokens: ${wrongTokensCount}`);
};

export const notification = { send };
