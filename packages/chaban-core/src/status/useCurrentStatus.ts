import { useEffect, useState } from 'react';
import { Status, getStatus } from './getStatus';
import useInterval from './useInterval';

export const useCurrentStatus = (closeAt?: Date, openAt?: Date) => {
  const [status, setStatus] = useState<Status>(getStatus(new Date(), closeAt, openAt));

  useEffect(() => {
    const nextStatus = getStatus(new Date(), closeAt, openAt);
    setStatus(nextStatus);
  }, [closeAt, openAt]);

  useInterval(
    () => {
      const nextStatus = getStatus(new Date(), closeAt, openAt);
      setStatus(nextStatus);
    },
    closeAt && openAt ? 1000 : null,
  );
  return status;
};
