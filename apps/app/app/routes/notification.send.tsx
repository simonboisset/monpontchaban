import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { api, filterNextBridgeEvents } from 'core';
import dayjs from 'dayjs';
import { PrismaClient } from 'db';
import type { ExpoPushMessage, ExpoPushTicket, ExpoPushToken } from 'expo-server-sdk';
import { Expo } from 'expo-server-sdk';

const sendNotification = async (tokens: ExpoPushToken[], title: string, message: string, data?: any) => {
  // const localExpoToken = await db.device.findFirst();

  const { EXPO_ACCESS_TOKEN } = process.env;
  if (!EXPO_ACCESS_TOKEN) {
    return json({ error: '[Send notification] Expo access token is not defined' }, { status: 400 });
  }
  let expo = new Expo({ accessToken: EXPO_ACCESS_TOKEN });
  let messages: ExpoPushMessage[] = [];
  for (let pushToken of tokens) {
    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(`Push token ${pushToken} is not a valid Expo push token`);
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
      console.error(error);
    }
  }
  // For checking delivery success of notification it could be find to add a cron every hours and getPushNotificationReceiptsAsync with all chunk ticket
  // const isSuccessTicket = (ticket: any): ticket is ExpoPushSuccessTicket => !!ticket?.id;
  // let receiptIds: ExpoPushReceiptId[] = [];
  // for (let ticket of tickets) {
  //   if (isSuccessTicket(ticket)) {
  //     receiptIds.push(ticket.id);
  //   }
  // }

  // let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);

  // for (let chunk of receiptIdChunks) {
  //   try {
  //     let receipts = await expo.getPushNotificationReceiptsAsync(chunk);
  //     for (let receiptId in receipts) {
  //       let { status } = receipts[receiptId];
  //       if (status === 'ok') {
  //         continue;
  //       } else if (status === 'error') {
  //         console.error(`There was an error sending a notification`);
  //       }
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }
};

export const action: ActionFunction = async ({ request }) => {
  const data = await request.json();

  const token = data.token;
  const { SEND_NOTIFICATION_TOKEN } = process.env;
  if (!SEND_NOTIFICATION_TOKEN) {
    return json({ error: '[Send notification] Token is not defined' }, { status: 400 });
  }

  if (token !== SEND_NOTIFICATION_TOKEN) {
    console.error('[Send Notification] Invalid token');
    return json({ error: '[Send Notification] Invalid token' }, { status: 400 });
  }
  const now = new Date();
  const nextEvent = ((await api.get())?.filter(filterNextBridgeEvents(new Date())) || [])[0];
  if (nextEvent && dayjs(nextEvent.closeAt).isAfter(now) && dayjs(nextEvent.closeAt).diff(now, 'hour') === 1) {
    const DATABASE_URL = process.env.DATABASE_URL;
    if (!DATABASE_URL) {
      throw new Error('[Notification Subscribe] DATABASE_URL is not defined');
    }
    const db = new PrismaClient({ datasources: { db: { url: process.env.DATABASE_URL } } });
    const devices = await db.device.findMany({ where: { active: true }, select: { token: true } });
    await db.$disconnect();
    try {
      await sendNotification(
        devices.map((d) => d.token),
        'Fermeture du pont Chaban-Delmas',
        `Le pont sera fermé de ${dayjs(nextEvent.closeAt).hour()}h${dayjs(nextEvent.closeAt).format('mm')} à ${dayjs(
          nextEvent.openAt,
        ).hour()}h${dayjs(nextEvent.openAt).format('mm')}`,
      );
    } catch (error) {
      console.error('[Send Notification] Error', error);
      return json({ error: '[Send Notification] Error' }, { status: 400 });
    }
    return json({ success: '[Send Notification] Success' }, { status: 200 });
  }
  return json({ success: '[Send Notification] No notification to send' }, { status: 200 });
};

export const loader: LoaderFunction = async ({ request }) => {
  const { MY_PUSH_TOKEN } = process.env;
  if (!MY_PUSH_TOKEN) {
    return json({ error: '[Send notification test] My Token is not defined' }, { status: 400 });
  }

  const nextEvent = ((await api.get())?.filter(filterNextBridgeEvents(new Date())) || [])[0];
  if (nextEvent) {
    try {
      await sendNotification(
        [MY_PUSH_TOKEN],
        'Fermeture du pont Chaban-Delmas',
        `Le pont sera fermé de ${dayjs(nextEvent.closeAt).hour()}h${dayjs(nextEvent.closeAt).format('mm')} à ${dayjs(
          nextEvent.openAt,
        ).hour()}h${dayjs(nextEvent.openAt).format('mm')}`,
      );
    } catch (error) {
      console.error('[Send Notification] Error', error);
      return json({ error: '[Send Notification] Error' }, { status: 400 });
    }
    return json({ success: '[Send Notification] Success' }, { status: 200 });
  }
  return json({ success: '[Send Notification] No notification to send' }, { status: 200 });
};
