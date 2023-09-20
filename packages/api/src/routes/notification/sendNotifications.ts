import { Schedule, prisma } from '@chaban/db';
import { TRPCError } from '@trpc/server';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone.js';
import utc from 'dayjs/plugin/utc.js';
import { createProcedure } from '../../config/api';
import { services } from '../../services';
import { isCron } from '../context';

export const sendNotifications = createProcedure.use(isCron).mutation(async () => {
  const now = new Date();
  const rules = await prisma.notificationRule.findMany({
    where: { schedules: { some: { day: now.getDay(), hour: now.getHours() } } },
    include: { schedules: true },
  });

  for (const rule of rules) {
    const nextSchedule = getNextSchedule(rule.schedules, now);
    const nextScheduleDate = getDateFromSchedule(nextSchedule, now);

    const limitStartBefore = dayjs(nextScheduleDate).add(rule.delayMinBefore, 'minute').toDate();
    const limitStartAfter = dayjs(now).add(rule.delayMinBefore, 'minute').toDate();

    const alertToNotify = await prisma.alert.findMany({
      where: { startAt: { lte: limitStartBefore, gte: limitStartAfter } },
    });

    await services.notification.send({
      tokens: [],
      badge: alertToNotify.length,
      title: `Evénements à venir pour le pont chaban`,
      message: `${alertToNotify
        .map((b) => `- ${b.title}: ${dayjs(b.startAt).format('HH:mm')} - ${dayjs(b.endAt).format('HH:mm')}`)
        .join('\n')}`,
    });
  }

  const chabanCount = await sendNotificationToChabanSubscribers(now);

  return rules.length + chabanCount;
});

const getNextSchedule = (schedules: Schedule[], now: Date) => {
  const currentSchedule = schedules.find((s) => s.day === now.getDay() && s.hour === now.getHours());
  if (!currentSchedule) {
    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'No schedule found for current time' });
  }

  let day = currentSchedule.day;
  let hour = currentSchedule.hour + 1;
  if (hour === 24) {
    hour = 0;
    day = (day + 1) % 7;
  }

  while (hour !== currentSchedule.hour || day !== currentSchedule.day) {
    const schedule = schedules.find((s) => s.day === day && s.hour === hour);
    if (schedule) {
      return schedule;
    }
    hour++;
    if (hour === 24) {
      hour = 0;
      day = (day + 1) % 7;
    }
  }
  return currentSchedule;
};

const getDateFromSchedule = (schedule: Schedule, now: Date) => {
  const nextScheduleDay = dayjs(now).set('hour', schedule.hour);
  if (schedule.day < now.getDay() || (schedule.day === now.getDay() && schedule.hour <= now.getHours())) {
    nextScheduleDay.add(1, 'week');
  }
  return nextScheduleDay.toDate();
};

const sendNotificationToChabanSubscribers = async (now: Date) => {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  const devices = await prisma.device.findMany({ where: { active: true } });
  const tokens = devices.map((d) => d.token);
  const nextScheduleDate = dayjs(now).add(1, 'hour').toDate();
  const delayMinBefore = 60;
  const delta = 10;

  const limitStartBefore = dayjs(nextScheduleDate)
    .add(delayMinBefore + delta, 'minute')
    .toDate();
  const limitStartAfter = dayjs(now)
    .add(delayMinBefore - delta, 'minute')
    .toDate();

  const alertToNotify = await prisma.alert.findMany({
    where: { startAt: { lte: limitStartBefore, gte: limitStartAfter } },
    orderBy: { startAt: 'asc' },
  });

  for (const alert of alertToNotify) {
    await services.notification.send({
      tokens,
      badge: 1,
      title: 'Prochaine levée de pont',
      message: `Le pont Chaban-Delmas sera fermé de ${dayjs.tz(alert.startAt, 'Europe/Paris').format('HH:mm')} à ${dayjs
        .tz(alert.endAt, 'Europe/Paris')
        .format('HH:mm')}`,
    });
  }
  return alertToNotify.length;
};
