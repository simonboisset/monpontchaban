import Expo, { ExpoPushMessage, ExpoPushTicket, ExpoPushToken } from 'expo-server-sdk';
import { getConfig } from '~/domain/config/getConfig';
import { chabanMonitor } from '~/domain/handler/handler';

export const sendNotification = async (tokens: ExpoPushToken[], title: string, message: string, data?: any) => {
  const { EXPO_ACCESS_TOKEN } = getConfig();

  let expo = new Expo({ accessToken: EXPO_ACCESS_TOKEN });
  let messages: ExpoPushMessage[] = [];
  for (let pushToken of tokens) {
    if (!Expo.isExpoPushToken(pushToken)) {
      chabanMonitor().error(`Push token ${pushToken} is not a valid Expo push token`);
      continue;
    }
    messages.push({ to: pushToken, sound: 'default', title, body: message, data, priority: 'high', badge: 1 });
  }

  let chunks = expo.chunkPushNotifications(messages);
  let tickets: ExpoPushTicket[] = [];

  for (let chunk of chunks) {
    try {
      let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    } catch (error) {
      chabanMonitor().error(error);
    }
  }
};
