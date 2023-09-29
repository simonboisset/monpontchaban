import { prisma } from '@chaban/db';
import { TRPCError } from '@trpc/server';
import { createProcedure } from '../../config/api';
import { apiBordeauxMetropole } from '../../managedApis';
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

  const data = await apiBordeauxMetropole.get();

  await prisma.alert.deleteMany({ where: { endAt: { gt: now } } });
  const alerts = await prisma.$transaction(data.map((d) => prisma.alert.create({ data: d })));

  const rules = await prisma.notificationRule.findMany({
    where: { scheduleIds: { has: schedule.id } },
    select: {
      title: true,
      delayMinBefore: true,
      scheduleIds: true,
      device: { select: { token: true } },
    },
  });

  const tokenRules = rules.map((r) => ({
    title: r.title,
    tokens: [r.device.token],
    delayMinBefore: r.delayMinBefore,
    scheduleIds: r.scheduleIds,
  }));

  const unAutheddevices = await prisma.device.findMany({ where: { sessions: { none: {} } } });
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
            `- ${b.title.toLowerCase()}: ${date.formatDay(b.startAt)} de ${date.formatTime(
              b.startAt,
            )} à ${date.formatTime(b.endAt)}`,
        )
        .join('\n')}`,
    });
    return [alertCount, tokenCount] as const;
  }
  return [0, 0] as const;
};
