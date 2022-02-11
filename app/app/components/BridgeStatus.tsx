import React from 'react';
import styled from 'styled-components';
import { fr } from '~/const/translation';
import useCurrentStatus from '~/hooks/useCurrentStatus';
import { BridgeEvent } from './BridgeEventItem';
import { ClosedLogo } from './ClosedLogo';
import { OpenedLogo } from './OpenedLogo';
import { Timer } from './Timer';

type BridgeStatusProps = BridgeEvent;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  border-radius: 16px;
  align-items: center;
  justify-content: center;
`;

const Text = styled.div`
  font-family: ${({ theme }) => theme.typography.status.font};
  font-size: ${({ theme }) => theme.typography.status.size}px;
  color: white;
`;

export const BridgeStatus: React.FC<{ event: BridgeStatusProps }> = ({ event }) => {
  const status = useCurrentStatus(event?.closeAt, event?.openAt);

  switch (status || !event) {
    case 'OPEN':
      return (
        <Container>
          <OpenedLogo bottom={24} />
          <Text>{fr.opened}</Text>
        </Container>
      );

    case 'WILL_CLOSE':
      return (
        <Container>
          <OpenedLogo bottom={24} />
          <Text>
            {fr.closeIn} <Timer date={event.closeAt} />
          </Text>
        </Container>
      );

    case 'CLOSED':
      return (
        <Container>
          <ClosedLogo bottom={24} />
          <Text>
            {fr.reopenIn} <Timer date={event.openAt} />
          </Text>
        </Container>
      );
    default:
      return (
        <Container>
          <OpenedLogo bottom={24} />
          <Text>{fr.opened}</Text>
        </Container>
      );
  }
};