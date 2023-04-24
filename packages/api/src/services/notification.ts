import type { ExpoPushMessage, ExpoPushTicket, ExpoPushToken } from 'expo-server-sdk';
import Expo from 'expo-server-sdk';
import { env } from '../config/env';

type SendNotificationParams = {
  tokens: ExpoPushToken[];
  title: string;
  message: string;
  priority?: 'default' | 'normal' | 'high';
  badge?: number;
};
const send = async ({ message, title, tokens, badge, priority }: SendNotificationParams) => {
  let expo = new Expo({ accessToken: env.EXPO_ACCESS_TOKEN });
  let messages: ExpoPushMessage[] = [];
  for (let pushToken of tokens) {
    if (!Expo.isExpoPushToken(pushToken)) {
      continue;
    }
    messages.push({ to: pushToken, sound: 'default', title, body: message, priority, badge });
  }

  let chunks = expo.chunkPushNotifications(messages);
  let tickets: ExpoPushTicket[] = [];

  for (let chunk of chunks) {
    try {
      let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    } catch (error) {}
  }
};

export const notification = { send };
