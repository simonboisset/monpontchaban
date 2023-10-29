import { schedules } from '@chaban/core';
import { prisma } from '@chaban/db';
import { TRPCError } from '@trpc/server';
import { createProcedure } from '../../config/api';
import { apiBordeauxMetropole } from '../../managedApis';
import { services } from '../../services';
import { isCron } from '../context';
import { getCurrenSchedule } from './getAlertsToNotify';

export const sendNotifications = createProcedure.use(isCron).mutation(async () => {
  const now = new Date();
  const start = Date.now();
  const schedule = getCurrenSchedule(now, schedules);
  if (!schedule) {
    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'No schedule found for current time' });
  }

  const data = await apiBordeauxMetropole.get();

  await prisma.alert.deleteMany({ where: { endAt: { gt: now } } });
  const alerts = await prisma.$transaction(data.map((d) => prisma.alert.create({ data: d })));

  console.info(`Alerts created: ${alerts.length}, time: ${Date.now() - start}ms`);

  const rules = await prisma.notificationRule.findMany({
    where: { scheduleIds: { has: schedule.id }, active: true },
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
  console.info(`Rules created: ${fullRules.length}, time: ${Date.now() - start}ms`);
  await services.notification.sendNotificationRules(now, alerts, fullRules);
  console.info(`Notifications sent, time: ${Date.now() - start}ms`);
  return fullRules.length;
});
