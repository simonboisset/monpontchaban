import { useEffect, useState } from 'react';

export const useNow = () => {
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

  return now;
};
