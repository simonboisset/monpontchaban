import dayjs from 'dayjs';

export const getStatus = (now: Date, closeAt?: Date, openAt?: Date) => {
  if (!openAt || !closeAt) {
    return 'OPEN';
  }

  const diffCloseToNow = dayjs(closeAt).diff(now, 's');
  if (diffCloseToNow > 0 && diffCloseToNow <= 12 * 3600) {
    return 'WILL_CLOSE';
  }

  if (diffCloseToNow <= 0 && dayjs(openAt).isAfter(now)) {
    return 'CLOSED';
  }

  return 'OPEN';
};
