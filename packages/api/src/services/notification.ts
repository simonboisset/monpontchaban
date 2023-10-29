import { schedules } from '@chaban/core';
import type { ExpoPushMessage, ExpoPushTicket, ExpoPushToken } from 'expo-server-sdk';
import Expo from 'expo-server-sdk';
import { env } from '../config/env';
import { date } from '../routes/notification/date';
import { getAlertsToNotify } from '../routes/notification/getAlertsToNotify';

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
type Rule = {
  title: string;
  tokens: string[];
  delayMinBefore: number;
  scheduleIds: number[];
};
type Alert = {
  id: string;
  title: string;
  startAt: Date;
  endAt: Date;
};
const filterUndefined = <T>(array: (T | undefined)[]): T[] => array.filter((a) => a !== undefined) as T[];

const sendNotificationRules = async (now: Date, alerts: Alert[], rules: Rule[]) => {
  let expo = new Expo({ accessToken: env.EXPO_ACCESS_TOKEN });
  let alertCount = 0;
  let tokenCount = 0;

  let messages: ExpoPushMessage[] = [];

  const createChunkFromRule = async (rule: Rule) => {
    const ruleSchedules = filterUndefined(rule.scheduleIds.map((id) => schedules.find((s) => s.id === id)));
    const alertToNotify = getAlertsToNotify(now, alerts, ruleSchedules, rule.delayMinBefore);

    if (alertToNotify.length > 0) {
      alertCount += alertToNotify.length;
      tokenCount += rule.tokens.length;

      const message = `${alertToNotify
        .map(
          (b) =>
            `- ${b.title.toLowerCase()}: ${date.formatDay(b.startAt)} de ${date.formatTime(
              b.startAt,
            )} à ${date.formatTime(b.endAt)}`,
        )
        .join('\n')}`;

      for (let pushToken of rule.tokens) {
        messages.push({
          to: pushToken,
          sound: 'default',
          title: rule.title,
          body: message,
          badge: alertToNotify.length,
        });
      }
    }
  };

  await Promise.all(rules.map(createChunkFromRule));

  let chunks = expo.chunkPushNotifications(messages);
  let tickets: ExpoPushTicket[] = [];
  let sendErrorCount = 0;

  await Promise.all(
    chunks.map(async (chunk) => {
      try {
        let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        sendErrorCount++;
      }
    }),
  );

  sendErrorCount += tickets.map((t) => t.status).filter((s) => s !== 'ok').length;

  console.info(`[sendNotifications]: Sent ${alertCount} alerts to ${tokenCount} tokens, errors: ${sendErrorCount}`);
};

export const notification = { send, sendNotificationRules };
