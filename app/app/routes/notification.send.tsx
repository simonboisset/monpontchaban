import type { ActionFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import dayjs from 'dayjs';
import type { ExpoPushMessage, ExpoPushTicket, ExpoPushToken } from 'expo-server-sdk';
import { Expo } from 'expo-server-sdk';
import { api } from '~/const/api';
import db from '~/const/db.server';
import { filterNextBridgeEvents } from '~/const/filterNextBridgeEvents';

const sendNotification = async (tokens: ExpoPushToken[], title: string, message: string, data?: any) => {
  const { SEND_NOTIFICATION_TOKEN } = process.env;
  if (!SEND_NOTIFICATION_TOKEN) {
    return json({ error: '[Send notification] Token is not defined' }, { status: 400 });
  }
  let expo = new Expo({ accessToken: SEND_NOTIFICATION_TOKEN });
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
  if (request.headers.get('token') === process.env.SENT_NOTIFICATION_TOKEN) {
    const now = new Date();
    const nextEvent = ((await api.get())?.filter(filterNextBridgeEvents(new Date())) || [])[0];
    if (nextEvent) {
      const devices = await db.device.findMany({ where: { active: true }, select: { token: true } });
      try {
        await sendNotification(
          devices.map((d) => d.token),
          'Fermeture du pont Chaban-Delmas',
          `Le pont sera fermé de ${dayjs(nextEvent.closeAt).hour()}h${dayjs(nextEvent.closeAt).format('mm')} à ${dayjs(
            nextEvent.openAt,
          ).hour()}h${dayjs(nextEvent.openAt).format('mm')}`,
        );
      } catch (error) {
        return json({ error: '[Send Notification] Error' }, { status: 400 });
      }
      return json({ success: '[Send Notification] Success' }, { status: 200 });
    }
  }
};
