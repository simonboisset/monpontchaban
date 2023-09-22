import { Alert } from '@chaban/db';
import dayjs from 'dayjs';
import { Schedule } from '../../schedules';

export const getAlertsToNotify = (now: Date, alerts: Alert[], schedules: Schedule[], beforeLimit: number) => {
  const currentSchedule = getCurrenSchedule(now, schedules);
  const nextSchedule = getNextSchedule(now, schedules);
  if (!nextSchedule || !currentSchedule) {
    return [];
  }
  const currentScheduleDate = dayjs()
    .startOf('hour')
    .set('hour', currentSchedule.hour)
    .set('day', currentSchedule.day)
    .toDate();
  const nextScheduleDate = getDateFromNextSchedule(nextSchedule, now);
  const alertsToNotify = alerts.filter((a) => {
    const alertDate = dayjs(a.startAt);
    return (
      (alertDate.isSame(dayjs(currentScheduleDate).add(beforeLimit, 'minute'), 'minute') ||
        alertDate.isAfter(dayjs(currentScheduleDate).add(beforeLimit, 'minute'))) &&
      alertDate.isBefore(dayjs(nextScheduleDate).add(beforeLimit, 'minute'))
    );
  });

  return alertsToNotify;
};

export const getNextSchedule = (now: Date, schedules: Schedule[]) => {
  const currentSchedule = getCurrenSchedule(now, schedules);
  if (!currentSchedule) {
    return undefined;
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

// Warning day 0 is sunday
export const getCurrenSchedule = (now: Date, schedules: Schedule[]) =>
  schedules.find((s) => s.day === now.getDay() && s.hour === now.getHours());

export const getDateFromNextSchedule = (schedule: Schedule, now: Date) => {
  const currentSchedule = getCurrenSchedule(now, [schedule]);
  if (currentSchedule) {
    return dayjs()
      .startOf('hour')
      .set('hour', currentSchedule.hour)
      .set('day', currentSchedule.day)
      .add(1, 'week')
      .toDate();
  }
  return dayjs().startOf('hour').set('hour', schedule.hour).set('day', schedule.day).toDate();
};
