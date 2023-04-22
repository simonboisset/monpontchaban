import type {ExpoPushMessage, ExpoPushTicket, ExpoPushToken} from 'expo-server-sdk';
import Expo from 'expo-server-sdk';
import {env} from '../config/env';

const send = async (tokens: ExpoPushToken[], title: string, message: string, data?: any) => {
  let expo = new Expo({accessToken: env.EXPO_ACCESS_TOKEN});
  let messages: ExpoPushMessage[] = [];
  for (let pushToken of tokens) {
    if (!Expo.isExpoPushToken(pushToken)) {
      continue;
    }
    messages.push({to: pushToken, sound: 'default', title, body: message, data, priority: 'high', badge: 1});
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

export const notification = {send};
