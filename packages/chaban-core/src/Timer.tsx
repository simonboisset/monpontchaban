import React, { useEffect, useState } from 'react';

const getDiff = (d1: Date | string, d2: Date | string) => {
  const date1 = new Date(d1);
  const date2 = new Date(d2);
  const delta = Math.abs(date2.getTime() - date1.getTime());
  const h = Math.floor(delta / 3600 / 1000);
  const m = Math.floor((delta - h * 3600 * 1000) / 60 / 1000);
  const s = Math.floor((delta - h * 3600 * 1000 - m * 60 * 1000) / 1000);
  const hours = !!h ? `${h}h` : '';
  const minutes = !!m || !!h ? `${m < 10 ? '0' : ''}${m}m` : '';
  const secondes = `${s < 10 ? '0' : ''}${s}s`;
  return `${hours}${minutes}${secondes}`;
};

type TimerProps = { date?: Date };
export const Timer: React.FC<TimerProps> = ({ date }) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const updateTime = () => {
      setNow(new Date());
    };
    const delay = new Date().getTime() - Math.floor(new Date().getTime() / 1000) * 1000;

    const intervall = setInterval(() => {
      setTimeout(() => {
        updateTime();
      }, delay);
    }, 1000);
    return () => clearInterval(intervall);
  }, []);
  return <>{!!date ? getDiff(now, date) : null}</>;
};
