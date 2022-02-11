import dayjs from 'dayjs';

export const getStatus = (now: Date, openAt?: Date, closeAt?: Date) => {
  if (!openAt || !closeAt) {
    return 'OPEN';
  }
  if (dayjs(closeAt).isToday()) {
    if (dayjs(closeAt).isAfter(now)) {
      return 'WILL_CLOSE';
    }
    if (dayjs(openAt).isBefore(now)) {
      return 'OPEN';
    }
    return 'CLOSED';
  }
  return 'OPEN';
};
