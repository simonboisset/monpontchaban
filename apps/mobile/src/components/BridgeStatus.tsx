import { fr, Timer, useCurrentStatus } from '@chaban/core';
import { Alert } from '@chaban/sdk';
import React from 'react';
import { H2 } from 'tamagui';

type BridgeStatusProps = Alert;

export const BridgeStatus: React.FC<{ event?: BridgeStatusProps }> = ({ event }) => {
  const status = useCurrentStatus(event?.startAt, event?.endAt);
  switch (status || !event) {
    case 'OPEN':
      return (
        <H2 color='$primary' textAlign='center' flex={1}>
          {fr.opened}
        </H2>
      );

    case 'WILL_CLOSE':
      return (
        <H2 color='$primary' textAlign='center' flex={1}>
          {fr.closeIn} {!!event && <Timer date={event?.startAt} />}
        </H2>
      );

    case 'CLOSED':
      return (
        <H2 color='$primary' textAlign='center' flex={1}>
          {fr.reopenIn} {!!event && <Timer date={event?.endAt} />}
        </H2>
      );
    default:
      return (
        <H2 color='$primary' textAlign='center' flex={1}>
          {fr.opened}
        </H2>
      );
  }
};
