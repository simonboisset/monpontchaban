import { BridgeEvent } from 'App';
import { Theme } from 'const';
import dayjs from 'dayjs';
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
  box-shadow: ${({ theme }) => theme.shadow(3)};
  align-items: center;
  justify-content: center;
  background-color: ${({ color = 'white', theme }) => theme.colors[color].main};
`;
type TextProps = {
  variant?: keyof Theme['typography'];
};
const Text = styled.div<TextProps>`
  font-family: ${({ variant = 'h5', theme }) => theme.typography[variant].font};
  font-size: ${({ variant = 'h5', theme }) => theme.typography[variant].size}px;
  color: white;
`;
export const BridgeStatus: React.FC<BridgeStatusProps> = ({ closeAt, openAt }) => {
  const now = new Date();

  if (dayjs(closeAt).isToday()) {
    if (dayjs(closeAt).isAfter(now)) {
      return (
        <Container color="warning">
          <Text variant="h1">
            Ferme dans <Timer date={closeAt} />
          </Text>
        </Container>
      );
    }
    if (dayjs(openAt).isBefore(now)) {
      return (
        <Container color="success">
          <Text>Ouvert</Text>
        </Container>
      );
    }
    return (
      <Container color="error">
        <Text>
          Reouvre dans <Timer date={openAt} />
        </Text>
      </Container>
    );
  }

  return (
    <Container color="success">
      <Text>Ouvert</Text>
    </Container>
  );
};
