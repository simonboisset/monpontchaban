import { BridgeEvent } from 'App';
import { fr, Theme } from 'const';
import { getStatus } from 'const/getStatus';
import React from 'react';
import styled from 'styled-components';
import { Timer } from './Timer';

type BridgeStatusProps = BridgeEvent;
type ContainerProps = {
  color?: keyof Theme['colors'];
};
const Container = styled.div<ContainerProps>`
  display: flex;
  flex: 1;
  border-radius: 16px;
  align-items: center;
  justify-content: center;
  background-color: ${({ color = 'white', theme }) => theme.colors[color].main};
`;

const Text = styled.div`
  font-family: ${({ theme }) => theme.typography.status.font};
  font-size: ${({ theme }) => theme.typography.status.size}px;
  color: white;
`;

export const BridgeStatus: React.FC<BridgeStatusProps> = ({ closeAt, openAt }) => {
  switch (getStatus(new Date(), openAt, closeAt)) {
    case 'OPEN':
      return (
        <Container color="success">
          <Text>{fr.opened}</Text>
        </Container>
      );

    case 'WILL_CLOSE':
      return (
        <Container color="warning">
          <Text>
            {fr.closeIn} <Timer date={closeAt} />
          </Text>
        </Container>
      );

    case 'CLOSED':
      return (
        <Container color="error">
          <Text>
            {fr.reopenIn} <Timer date={openAt} />
          </Text>
        </Container>
      );
    default:
      return (
        <Container color="success">
          <Text>{fr.opened}</Text>
        </Container>
      );
  }
};
