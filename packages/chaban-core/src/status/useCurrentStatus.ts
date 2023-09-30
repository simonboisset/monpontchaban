import { useState } from 'react';
import { Status, getStatus } from './getStatus';
import useInterval from './useInterval';

export const useCurrentStatus = (closeAt?: Date, openAt?: Date) => {
  const [status, setStatus] = useState<Status>(getStatus(new Date(), closeAt, openAt));

  useInterval(() => {
    const nextStatus = getStatus(new Date(), closeAt, openAt);
    setStatus(nextStatus);
  }, 1000);
  return status;
};
