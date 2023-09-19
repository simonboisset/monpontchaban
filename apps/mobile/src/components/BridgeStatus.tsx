import { fr, Timer, useCurrentStatus } from '@chaban/chaban-core';
import { Alert } from '@chaban/sdk';
import React from 'react';
import styled from 'styled-components/native';

type BridgeStatusProps = Alert;

const Text = styled.Text<{ dark: boolean }>`
  text-align: center;
  font-family: ${({ theme }) => theme.typography.status.font};
  font-size: ${({ theme }) => theme.typography.status.size}px;
  color: ${({ theme, dark }) => (dark ? theme.colors.background.main : 'white')};
`;

export const BridgeStatus: React.FC<{ event?: BridgeStatusProps; dark: boolean }> = ({ event, dark }) => {
  const status = useCurrentStatus(event?.startAt, event?.endAt);
  switch (status || !event) {
    case 'OPEN':
      return <Text dark={dark}>{fr.opened}</Text>;

    case 'WILL_CLOSE':
      return (
        <Text dark={dark}>
          {fr.closeIn} {!!event && <Timer date={event?.startAt} />}
        </Text>
      );

    case 'CLOSED':
      return (
        <Text dark={dark}>
          {fr.reopenIn} {!!event && <Timer date={event?.endAt} />}
        </Text>
      );
    default:
      return <Text dark={dark}>{fr.opened}</Text>;
  }
};
