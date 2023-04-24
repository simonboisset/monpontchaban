import { fr, Timer, useCurrentStatus } from '@lezo-alert/chaban-core';
import type { Alert } from '@lezo-alert/db';
import React from 'react';
import { ClosedLogo } from './ClosedLogo';
import { OpenedLogo } from './OpenedLogo';

type BridgeStatusProps = Alert;

export const BridgeStatus: React.FC<{ event: BridgeStatusProps }> = ({ event }) => {
  const status = useCurrentStatus(event?.startAt, event?.endAt);

  switch (status || !event) {
    case 'OPEN':
      return (
        <>
          <div className='mb-8 md:mb-12 md:w-52 w-40 lg:w-60'>
            <OpenedLogo />
          </div>
          <div className='mb-20 text-2xl md:text-4xl'>{fr.opened}</div>
        </>
      );

    case 'WILL_CLOSE':
      return (
        <>
          <div className='mb-8 md:mb-12 md:w-52 w-40 lg:w-60'>
            <OpenedLogo />
          </div>
          <div className='text-2xl md:text-4xl'>
            {fr.closeIn} <Timer date={event.startAt} />
          </div>
        </>
      );

    case 'CLOSED':
      return (
        <>
          <div className='mb-8 md:mb-12 md:w-52 w-40 lg:w-60 '>
            <ClosedLogo />
          </div>
          <div className='text-2xl md:text-4xl'>
            {fr.reopenIn} <Timer date={event.endAt} />
          </div>
        </>
      );
    default:
      return (
        <>
          <div className='mb-8 md:mb-12 md:w-52 w-40 lg:w-60'>
            <OpenedLogo />
          </div>
          <div className='text-2xl md:text-4xl'>{fr.opened}</div>
        </>
      );
  }
};
