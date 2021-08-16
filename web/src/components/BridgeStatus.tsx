import { BridgeEvent } from 'App';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Box } from 'styled-kit/Box';
import { Typography } from 'styled-kit/Typography';

type BridgeStatusProps = BridgeEvent;

const getDiff = (d1: Date, d2: Date) => {
  const delta = d2.getTime() - d1.getTime();
  const h = Math.floor(delta / 3600 / 1000);
  const m = Math.floor((delta - h * 3600 * 1000) / 60 / 1000);
  const s = Math.floor((delta - h * 3600 * 1000 - m * 60 * 1000) / 1000);
  return `${h < 10 ? '0' : ''}${h}h${m < 10 ? '0' : ''}${m}m${s < 10 ? '0' : ''}${s}s`;
};

const BridgeStatus: React.FC<BridgeStatusProps> = ({ closeAt, openAt }) => {
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

  if (dayjs(closeAt).isToday()) {
    if (dayjs(closeAt).isAfter(now)) {
      return (
        <Box elevation={3} radius padding={5} margin={5} direction="column">
          <Typography>Ferme dans {getDiff(now, closeAt)}</Typography>
        </Box>
      );
    }
    if (dayjs(openAt).isBefore(now)) {
      return (
        <Box elevation={3} radius padding={5} margin={5} direction="column">
          <Typography>Ouvert</Typography>
        </Box>
      );
    }
    return (
      <Box elevation={3} radius padding={5} margin={5} direction="column">
        <Typography>Reouvre dans {getDiff(now, openAt)}</Typography>
      </Box>
    );
  }

  return (
    <Box elevation={3} radius padding={5} margin={5} direction="column">
      <Typography>Ouvert</Typography>
    </Box>
  );
};

export default BridgeStatus;
