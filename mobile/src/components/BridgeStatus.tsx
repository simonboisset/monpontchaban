import { getStatus } from 'const/getStatus';
import React from 'react';
import styled from 'styled-components/native';
import { BridgeEvent } from '../../App';
import { Timer } from './Timer';

type BridgeStatusProps = BridgeEvent;

const Text = styled.Text`
  text-align: center;
  font-family: ${({ theme }) => theme.typography.status.font};
  font-size: ${({ theme }) => theme.typography.status.size}px;
  color: white;
`;

export const BridgeStatus: React.FC<BridgeStatusProps> = ({ closeAt, openAt }) => {
  switch (getStatus(new Date(), openAt, closeAt)) {
    case 'OPEN':
      return <Text>Ouvert</Text>;

    case 'WILL_CLOSE':
      return (
        <Text>
          Ferme dans <Timer date={closeAt} />
        </Text>
      );

    case 'CLOSED':
      return (
        <Text>
          Reouvre dans <Timer date={openAt} />
        </Text>
      );
    default:
      return <Text>Ouvert</Text>;
  }
};
