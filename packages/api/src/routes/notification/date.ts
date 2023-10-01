import { Schedule, fr } from '@chaban/core';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone.js';
import utc from 'dayjs/plugin/utc.js';

dayjs.extend(utc);
dayjs.extend(timezone);

const formatDay = (d: Date) => fr.weekDays[Number(dayjs.tz(d, 'Europe/Paris').format('d'))];
const formatTime = (d: Date) => dayjs.tz(d, 'Europe/Paris').format('HH:mm');
const getFromSchedule = (schedule: Schedule, d: Date) => {
  const date = dayjs.tz(d, 'Europe/Paris').startOf('hour').set('hour', schedule.hour).set('day', schedule.day).toDate();
  if (dayjs(date).isBefore(d, 'hour')) {
    return dayjs(date).add(1, 'week').toDate();
  }
  return date;
};

const isCurrentSchedule = (schedule: Schedule, d: Date) => {
  const date = getFromSchedule(schedule, d);
  return dayjs(date).isSame(d, 'hour');
};

export const date = { getFromSchedule, formatDay, isCurrentSchedule, formatTime };
