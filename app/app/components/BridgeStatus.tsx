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
        <>
          <div className='mb-8 md:mb-12 md:w-52 w-40 lg:w-60'>
            <OpenedLogo />
          </div>
          <div className='mb-20 text-2xl md:text-4xl text-white'>{fr.opened}</div>
        </>
      );

    case 'WILL_CLOSE':
      return (
        <>
          <div className='mb-8 md:mb-12 md:w-52 w-40 lg:w-60'>
            <OpenedLogo />
          </div>
          <div className='text-2xl md:text-4xl text-white'>
            {fr.closeIn} <Timer date={event.closeAt} />
          </div>
        </>
      );

    case 'CLOSED':
      return (
        <>
          {' '}
          <div className='mb-8 md:mb-12 md:w-52 w-40 lg:w-60 '>
            <ClosedLogo />
          </div>
          <div className='text-2xl md:text-4xl text-white'>
            {fr.reopenIn} <Timer date={event.openAt} />
          </div>
        </>
      );
    default:
      return (
        <>
          <div className='mb-8 md:mb-12 md:w-52 w-40 lg:w-60'>
            <OpenedLogo />
          </div>
          <div className='text-2xl md:text-4xl text-white'>{fr.opened}</div>
        </>
      );
  }
};
