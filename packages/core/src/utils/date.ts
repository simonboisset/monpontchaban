import dayjs from 'dayjs';

export const isToday = (date: Date) => dayjs(date).isSame(dayjs(), 'day');
export const isTomorrow = (date: Date) => dayjs(date).isSame(dayjs().add(1, 'day'), 'day');
export const isThisWeek = (date: Date) => dayjs(date).isSame(dayjs(), 'week');
export const isNextWeek = (date: Date) => dayjs(date).isSame(dayjs().add(1, 'week'), 'week');
