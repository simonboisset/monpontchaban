import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import isTomorrow from 'dayjs/plugin/isTomorrow';
import React from 'react';
import { fr } from '~/const/translation';
import { ClosedLogo } from './ClosedLogo';
import { OpenedLogo } from './OpenedLogo';

export type BridgeEvent = { closeAt: string; openAt: string };

type BridgeEventItemProps = BridgeEvent;
dayjs.extend(isToday);
dayjs.extend(isTomorrow);

export const BridgeEventItem: React.FC<BridgeEventItemProps> = ({ closeAt, openAt }) => {
  return (
    <div className='flex flex-col p-5 bg-white dark:bg-slate-800 rounded-3xl drop-shadow-lg space-y-1 dark:text-slate-400 text-slate-600'>
      <div className='flex flex-row items-center '>
        {dayjs(closeAt).tz('Europe/Paris').isTomorrow()
          ? 'Demain '
          : dayjs(closeAt).tz('Europe/Paris').isToday()
          ? "Aujourd'hui "
          : fr.weekDays[Number(dayjs(closeAt).tz('Europe/Paris').format('d'))] +
            ' ' +
            dayjs(closeAt).tz('Europe/Paris').format('DD') +
            ' ' +
            fr.month[dayjs(closeAt).tz('Europe/Paris').month()] +
            ' '}
      </div>
      <div className='flex flex-row items-center'>
        <div className='w-6 mr-4 text-red'>
          <ClosedLogo />
        </div>
        {dayjs(closeAt).tz('Europe/Paris').hour()}h{dayjs(closeAt).tz('Europe/Paris').format('mm')}
      </div>
      <div className='flex flex-row items-center'>
        <div className='w-6 mr-4 text-green'>
          <OpenedLogo />
        </div>
        {dayjs(openAt).tz('Europe/Paris').hour()}h{dayjs(openAt).tz('Europe/Paris').format('mm')}
      </div>
    </div>
  );
};
