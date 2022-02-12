import React from 'react';
import { fr } from '~/const/translation';
import useCurrentStatus from '~/hooks/useCurrentStatus';
import { BridgeEvent } from './BridgeEventItem';
import { ClosedLogo } from './ClosedLogo';
import { OpenedLogo } from './OpenedLogo';
import { Timer } from './Timer';

type BridgeStatusProps = BridgeEvent;

export const BridgeStatus: React.FC<{ event: BridgeStatusProps }> = ({ event }) => {
  const status = useCurrentStatus(event?.closeAt, event?.openAt);

  switch (status || !event) {
    case 'OPEN':
      return (
        <div className='flex grow flex-col items-center justify-center'>
          <div className='mb-8 w-2/6'>
            <OpenedLogo />
          </div>
          <div className='text-6xl text-white'>{fr.opened}</div>
        </div>
      );

    case 'WILL_CLOSE':
      return (
        <div className='flex grow flex-col items-center justify-center'>
          <div className='mb-8 w-2/6'>
            <OpenedLogo />
          </div>
          <div className='text-6xl text-white'>
            {fr.closeIn} <Timer date={event.closeAt} />
          </div>
        </div>
      );

    case 'CLOSED':
      return (
        <div className='flex grow flex-col items-center justify-center'>
          <div className='mb-8 w-2/6 '>
            <ClosedLogo />
          </div>
          <div className='text-6xl text-white'>
            {fr.reopenIn} <Timer date={event.openAt} />
          </div>
        </div>
      );
    default:
      return (
        <div className='flex grow flex-col items-center justify-center'>
          <div className='mb-8 w-2/6'>
            <OpenedLogo />
          </div>
          <div className='text-6xl text-white'>{fr.opened}</div>
        </div>
      );
  }
};
