import { Schedule } from '@chaban/core';
import { Alert } from '@chaban/db';
import dayjs from 'dayjs';

export type SchedulesWithDate = Schedule & { date: Date };

export const getAlertsToNotify = (now: Date, alerts: Alert[], schedules: SchedulesWithDate[], beforeLimit: number) => {
  const currentScheduleId = getCurrenScheduleId(now, schedules);

  if (currentScheduleId === -1) {
    return [];
  }
  const nextScheduleDate = getNextScheduleDate(schedules, currentScheduleId);
  const currentScheduleDate = schedules[currentScheduleId].date;

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

export const getNextScheduleDate = (schedules: SchedulesWithDate[], currentScheduleId: number) => {
  if (schedules.length === 1) {
    return new Date(schedules[0].date.getTime() + 7 * 24 * 60 * 60 * 1000);
  }
  return schedules[(currentScheduleId + 1) % schedules.length].date;
};

// Warning day 0 is sunday
export const getCurrenScheduleId = (now: Date, schedules: SchedulesWithDate[]) =>
  schedules.findIndex((s) => dayjs(now).isSame(s.date, 'hour'));
