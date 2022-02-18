import { fr } from 'const/translation';
import React from 'react';
import styled from 'styled-components/native';
import { BridgeEvent } from '../../App';
import useCurrentStatus from '../hooks/useCurrentStatus';
import { Timer } from './Timer';

type BridgeStatusProps = BridgeEvent;

const Text = styled.Text<{ dark: boolean }>`
  text-align: center;
  font-family: ${({ theme }) => theme.typography.status.font};
  font-size: ${({ theme }) => theme.typography.status.size}px;
  color: ${({ theme, dark }) => (dark ? theme.colors.background.main : 'white')};
`;

export const BridgeStatus: React.FC<{ event: BridgeStatusProps; dark: boolean }> = ({ event, dark }) => {
  const status = useCurrentStatus(event?.closeAt, event?.openAt);
  switch (status || !event) {
    case 'OPEN':
      return <Text dark={dark}>{fr.opened}</Text>;

    case 'WILL_CLOSE':
      return (
        <Text dark={dark}>
          {fr.closeIn} <Timer date={event.closeAt} />
        </Text>
      );

    case 'CLOSED':
      return (
        <Text dark={dark}>
          {fr.reopenIn} <Timer date={event.openAt} />
        </Text>
      );
    default:
      return <Text dark={dark}>{fr.opened}</Text>;
  }
};
