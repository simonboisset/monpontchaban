import dayjs from 'dayjs';

export const isToday = (date: Date, now: Date) => dayjs(date).isSame(now, 'day');
export const isTomorrow = (date: Date, now: Date) => dayjs(date).isSame(dayjs(now).add(1, 'day'), 'day');
export const isThisWeek = (date: Date, now: Date) =>
  !isToday(date, now) &&
  !isTomorrow(date, now) &&
  dayjs(date).subtract(1, 'day').isSame(dayjs(now).subtract(1, 'day'), 'week');

export const isNextWeek = (date: Date, now: Date) =>
  dayjs(date).subtract(1, 'day').isSame(dayjs(now).subtract(1, 'day').add(1, 'week'), 'week');
