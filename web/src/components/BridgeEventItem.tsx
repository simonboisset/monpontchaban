import { BridgeEvent } from 'App';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import isTomorrow from 'dayjs/plugin/isTomorrow';
import React from 'react';
import { Box } from 'styled-kit/Box';
import { Typography } from 'styled-kit/Typography';
import { fr } from 'tools/translation';
type BridgeEventItemProps = BridgeEvent;
dayjs.extend(isToday);
dayjs.extend(isTomorrow);

const BridgeEventItem: React.FC<BridgeEventItemProps> = ({ closeAt, openAt }) => {
  return (
    <Box elevation={3} radius padding={5} margin={5} direction="column">
      <Typography>
        Fermeture{' '}
        {dayjs(closeAt).isTomorrow()
          ? 'demain '
          : dayjs(closeAt).isToday()
          ? "aujourd'hui "
          : 'le ' +
            fr.weekDays[Number(dayjs(closeAt).format('d'))] +
            ' ' +
            dayjs(closeAt).format('DD') +
            ' ' +
            fr.month[dayjs(closeAt).month()] +
            ' '}
        à {dayjs(closeAt).hour()}h{dayjs(closeAt).format('mm')}
      </Typography>
      <Typography>
        Ouverture{' '}
        {dayjs(openAt).isTomorrow()
          ? 'demain '
          : dayjs(openAt).isToday()
          ? "aujourd'hui "
          : 'le ' +
            fr.weekDays[Number(dayjs(openAt).format('d'))] +
            ' ' +
            dayjs(openAt).format('DD') +
            ' ' +
            fr.month[dayjs(openAt).month()] +
            ' '}
        à {dayjs(openAt).hour()}h{dayjs(openAt).format('mm')}
      </Typography>
    </Box>
  );
};

export default BridgeEventItem;
