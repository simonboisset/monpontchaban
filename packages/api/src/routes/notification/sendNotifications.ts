import { prisma } from '@chaban/db';
import { TRPCError } from '@trpc/server';
import dayjs from 'dayjs';

import { createProcedure } from '../../config/api';
import { schedules } from '../../schedules';
import { services } from '../../services';
import { isCron } from '../context';
import { date } from './date';
import { getAlertsToNotify } from './getAlertsToNotify';
export const sendNotifications = createProcedure.use(isCron).mutation(async () => {
  const now = new Date();
  const schedule = schedules.find((s) => s.day === now.getDay() && s.hour === now.getHours());
  if (!schedule) {
    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'No schedule found for current time' });
  }
  const rules = await prisma.notificationRule.findMany({
    where: { scheduleIds: { has: schedule.id } },
    select: {
      delayMinBefore: true,
      scheduleIds: true,
      user: { select: { devices: { select: { token: true } } } },
    },
  });

  const tokenRules = rules.map((r) => ({
    title: `⏰ Alerte Fermeture du pont chaban`,
    tokens: r.user.devices.map((d) => d.token),
    delayMinBefore: r.delayMinBefore,
    scheduleIds: r.scheduleIds,
  }));

  const oneWeekOneDayAfter = dayjs(now).add(1, 'week').add(1, 'day').toDate();
  const alerts = await prisma.alert.findMany({
    where: { startAt: { lte: oneWeekOneDayAfter, gte: now } },
  });

  const unAutheddevices = await prisma.device.findMany({ where: { userId: null } });
  const unAuthedtokens = unAutheddevices.map((d) => d.token);

  const baseRule = {
    title: `⏰ Alerte Fermeture du pont chaban`,
    delayMinBefore: 60,
    scheduleIds: schedules.map((s) => s.id),
    tokens: unAuthedtokens,
  };

  const dailyRule = {
    title: `🌉 Demain Fermeture du pont chaban`,
    delayMinBefore: 300,
    scheduleIds: schedules.filter((s) => s.hour === 20).map((s) => s.id),
    tokens: unAuthedtokens,
  };

  const weeklyRule = {
    title: `📅 Récap Hebdos du pont chaban`,
    delayMinBefore: 300,
    scheduleIds: schedules.filter((s) => s.day === 0 && s.hour === 19).map((s) => s.id),
    tokens: unAuthedtokens,
  };

  const fullRules = [...tokenRules, baseRule, dailyRule, weeklyRule];

  const results = await Promise.all(fullRules.map((r) => sendNotificationRule(now, alerts, r)));

  let tokenCount = 0;
  let alertCount = 0;
  results.forEach(([aCount, tCount]) => {
    tokenCount += tCount;
    alertCount += aCount;
  });
  console.info(`[sendNotifications]: Sent ${alertCount} alerts to ${tokenCount} tokens`);
  return fullRules.length;
});

const filterUndefined = <T>(array: (T | undefined)[]): T[] => array.filter((a) => a !== undefined) as T[];
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
const sendNotificationRule = async (now: Date, alerts: Alert[], rule: Rule) => {
  const ruleSchedules = filterUndefined(rule.scheduleIds.map((id) => schedules.find((s) => s.id === id)));
  const alertToNotify = getAlertsToNotify(now, alerts, ruleSchedules, rule.delayMinBefore);
  if (alertToNotify.length > 0) {
    const alertCount = alertToNotify.length;
    const tokenCount = rule.tokens.length;
    await services.notification.send({
      tokens: rule.tokens,
      badge: alertToNotify.length,
      title: rule.title,
      message: `${alertToNotify
        .map(
          (b) =>
            `- ${b.title}: ${date.formatDay(b.startAt)} de ${date.formatTime(b.startAt)} à ${date.formatTime(b.endAt)}`,
        )
        .join('\n')}`,
    });
    return [alertCount, tokenCount] as const;
  }
  return [0, 0] as const;
};
