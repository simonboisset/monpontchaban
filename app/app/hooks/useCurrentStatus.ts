import { useState } from 'react';
import { getStatus } from '~/const/getStatus';
import useInterval from './useInterval';

const useCurrentStatus = (closeAt?: Date, openAt?: Date) => {
  const [status, setStatus] = useState<ReturnType<typeof getStatus>>(getStatus(new Date(), openAt, closeAt));
  useInterval(() => {
    const nextStatus = getStatus(new Date(), openAt, closeAt);
    if (nextStatus !== status) {
      setStatus(nextStatus);
    }
  }, 1000);
  return status;
};

export default useCurrentStatus;
