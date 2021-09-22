import React, { useEffect, useState } from 'react';

const getDiff = (d1: Date, d2: Date) => {
  const delta = d2.getTime() - d1.getTime();
  const h = Math.floor(delta / 3600 / 1000);
  const m = Math.floor((delta - h * 3600 * 1000) / 60 / 1000);
  const s = Math.floor((delta - h * 3600 * 1000 - m * 60 * 1000) / 1000);
  return `${h < 10 ? '0' : ''}${h}h${m < 10 ? '0' : ''}${m}m${s < 10 ? '0' : ''}${s}s`;
};

type TimerProps = { date: Date };
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
  return <>{getDiff(now, date)}</>;
};
