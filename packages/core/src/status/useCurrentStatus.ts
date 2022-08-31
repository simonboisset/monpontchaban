import { useState } from 'react';
import { getStatus } from './getStatus';
import useInterval from './useInterval';

export const useCurrentStatus = (closeAt?: Date, openAt?: Date) => {
  const [status, setStatus] = useState<ReturnType<typeof getStatus>>(getStatus(new Date(), closeAt, openAt));

  useInterval(() => {
    const nextStatus = getStatus(new Date(), closeAt, openAt);

    if (nextStatus !== status) {
      setStatus(nextStatus);
    }
  }, 1000);
  return status;
};
