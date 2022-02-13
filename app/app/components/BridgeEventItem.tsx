import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import isTomorrow from 'dayjs/plugin/isTomorrow';
import React from 'react';
import { fr } from '~/const/translation';
import { ClosedLogo } from './ClosedLogo';
import { OpenedLogo } from './OpenedLogo';

export type BridgeEvent = { closeAt: Date; openAt: Date };

type BridgeEventItemProps = BridgeEvent;
dayjs.extend(isToday);
dayjs.extend(isTomorrow);

export const BridgeEventItem: React.FC<BridgeEventItemProps> = ({ closeAt, openAt }) => {
  return (
    <div className='flex flex-col p-5 bg-white rounded-3xl drop-shadow-lg space-y-1'>
      <div className='flex flex-row items-center '>
        {dayjs(closeAt).isTomorrow()
          ? 'Demain '
          : dayjs(closeAt).isToday()
          ? "Aujourd'hui "
          : fr.weekDays[Number(dayjs(closeAt).format('d'))] +
            ' ' +
            dayjs(closeAt).format('DD') +
            ' ' +
            fr.month[dayjs(closeAt).month()] +
            ' '}
      </div>
      <div className='flex flex-row items-center'>
        <div className='w-6 mr-4 text-[#84a59d]'>
          <ClosedLogo />
        </div>
        {dayjs(closeAt).hour()}h{dayjs(closeAt).format('mm')}
      </div>
      <div className='flex flex-row items-center'>
        <div className='w-6 mr-4 text-[#f28482]'>
          <OpenedLogo />
        </div>
        {dayjs(openAt).hour()}h{dayjs(openAt).format('mm')}
      </div>
    </div>
  );
};
