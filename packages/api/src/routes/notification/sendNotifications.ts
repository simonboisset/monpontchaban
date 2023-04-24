import { Schedule, prisma } from '@lezo-alert/db';
import { TRPCError } from '@trpc/server';
import dayjs from 'dayjs';
import { createProcedure } from '../../config/api';
import { managedChannelIds } from '../../config/managedChannels';
import { services } from '../../services';
import { isCron } from '../context';

export const sendNotifications = createProcedure.use(isCron).mutation(async () => {
  const now = new Date();
  const rules = await prisma.notificationRule.findMany({
    where: { schedules: { some: { day: now.getDay(), hour: now.getHours() } } },
    include: { channel: true, schedules: true, user: { include: { devices: true } } },
  });

  for (const rule of rules) {
    const nextSchedule = getNextSchedule(rule.schedules, now);
    const nextScheduleDate = getDateFromSchedule(nextSchedule, now);

    const limitStartBefore = dayjs(nextScheduleDate).add(rule.delayMinBefore, 'minute').toDate();
    const limitStartAfter = dayjs(now).add(rule.delayMinBefore, 'minute').toDate();

    const alertToNotify = await prisma.alert.findMany({
      where: { channelId: rule.channelId, startAt: { lte: limitStartBefore, gte: limitStartAfter } },
    });

    await services.notification.send({
      tokens: rule.user.devices.map((d) => d.token),
      badge: alertToNotify.length,
      title: `Evénements à venir pour ${rule.channel.name}`,
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
  const devices = await prisma.device.findMany({ where: { active: true, userId: null } });
  const tokens = devices.map((d) => d.token);
  const nextScheduleDate = dayjs(now).add(1, 'hour').set('minute', 0).set('second', 0).set('millisecond', 0).toDate();
  const delayMinBefore = 30;

  const limitStartBefore = dayjs(nextScheduleDate).add(delayMinBefore, 'minute').toDate();
  const limitStartAfter = dayjs(now).add(delayMinBefore, 'minute').toDate();

  const alertToNotify = await prisma.alert.findMany({
    where: { channelId: managedChannelIds.chaban, startAt: { lte: limitStartBefore, gte: limitStartAfter } },
    orderBy: { startAt: 'asc' },
  });

  for (const alert of alertToNotify) {
    await services.notification.send({
      tokens,
      badge: 1,
      title: 'Prochaine levée de pont',
      message: `Le pont Chaban-Delmas sera fermé de ${dayjs(alert.startAt).format('HH:mm')} à ${dayjs(
        alert.endAt,
      ).format('HH:mm')}`,
    });
  }
  return alertToNotify.length;
};
