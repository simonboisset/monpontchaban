import { fr } from 'const/translation';
import React from 'react';
import styled from 'styled-components/native';
import { BridgeEvent } from '../../App';
import useCurrentStatus from '../hooks/useCurrentStatus';
import { Timer } from './Timer';

type BridgeStatusProps = BridgeEvent;

const Text = styled.Text`
  text-align: center;
  font-family: ${({ theme }) => theme.typography.status.font};
  font-size: ${({ theme }) => theme.typography.status.size}px;
  color: white;
`;

export const BridgeStatus: React.FC<{ event: BridgeStatusProps }> = ({ event }) => {
  const status = useCurrentStatus(event?.closeAt, event?.openAt);
  switch (status || !event) {
    case 'OPEN':
      return <Text>{fr.opened}</Text>;

    case 'WILL_CLOSE':
      return (
        <Text>
          {fr.closeIn} <Timer date={event.closeAt} />
        </Text>
      );

    case 'CLOSED':
      return (
        <Text>
          {fr.reopenIn} <Timer date={event.openAt} />
        </Text>
      );
    default:
      return <Text>{fr.opened}</Text>;
  }
};
