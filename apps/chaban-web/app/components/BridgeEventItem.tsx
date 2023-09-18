import type { Alert } from '@lezo-alert/api';
import { fr } from '@lezo-alert/chaban-core';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday.js';
import isTomorrow from 'dayjs/plugin/isTomorrow.js';
import React from 'react';
import { ClosedLogo } from './ClosedLogo';
import { OpenedLogo } from './OpenedLogo';

type BridgeEventItemProps = Alert;
dayjs.extend(isToday);
dayjs.extend(isTomorrow);

export const BridgeEventItem: React.FC<BridgeEventItemProps> = ({ startAt, endAt, title }) => {
  return (
    <div className='flex flex-col p-5 z-20 w-full bg-background/30 rounded-lg drop-shadow-lg gap-4 font-bold'>
      <div className='flex flex-col md:flex-row items-center flex-wrap gap-1'>
        <span className='flex-1 whitespace-nowrap'>
          {dayjs(startAt).isTomorrow()
            ? 'Demain '
            : dayjs(startAt).isToday()
            ? "Aujourd'hui "
            : fr.weekDays[Number(dayjs(startAt).format('d'))] +
              ' ' +
              dayjs(startAt).format('DD') +
              ' ' +
              fr.month[dayjs(startAt).month()] +
              ' '}
        </span>
        <span className='font-semibold capitalize'>{title.toLocaleLowerCase()}</span>
      </div>
      <div className='flex justify-center items-center flex-row md:flex-col md:items-start w-full gap-4 md:gap-2 '>
        <div className='flex flex-row items-center text-error-foreground'>
          <div className='w-6 mr-4'>
            <ClosedLogo />
          </div>
          <span>
            {dayjs(startAt).hour()}h{dayjs(startAt).format('mm')}
          </span>
        </div>
        <div className='flex flex-row items-center text-success-foreground'>
          <div className='w-6 mr-4'>
            <OpenedLogo />
          </div>
          <span>
            {dayjs(endAt).hour()}h{dayjs(endAt).format('mm')}
          </span>
        </div>
      </div>
    </div>
  );
};
