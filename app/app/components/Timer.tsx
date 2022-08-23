import React, { useState } from 'react';
import useInterval from '~/hooks/useInterval';

const getDiff = (d1: Date, d2: Date) => {
  const delta = Math.abs(d2.getTime() - d1.getTime());
  const h = Math.floor(delta / 3600 / 1000);
  const m = Math.floor((delta - h * 3600 * 1000) / 60 / 1000);
  const s = Math.floor((delta - h * 3600 * 1000 - m * 60 * 1000) / 1000);
  const hours = h ? `${h}h` : '';
  const minutes = !!m || !!h ? `${m < 10 ? '0' : ''}${m}m` : '';
  const secondes = `${s < 10 ? '0' : ''}${s}s`;
  return `${hours}${minutes}${secondes}`;
};

type TimerProps = { date: Date };
export const Timer: React.FC<TimerProps> = ({ date }) => {
  const [now, setNow] = useState(new Date());
  useInterval(() => {
    setNow(new Date());
  }, 1000);

  return <>{getDiff(now, date)}</>;
};
