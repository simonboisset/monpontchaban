import { BridgeEvent } from 'App';
import { fr, Theme } from 'const';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import isTomorrow from 'dayjs/plugin/isTomorrow';
import React from 'react';
import styled from 'styled-components';
type BridgeEventItemProps = BridgeEvent;
dayjs.extend(isToday);
dayjs.extend(isTomorrow);

const Item = styled.div`
  display: flex;
  flex-direction: column;
  box-shadow: ${({ theme }) => theme.shadow(3)};
  border-radius: 16px;
  margin-bottom: 20px;
  padding: 20px;
`;

type TextProps = {
  variant?: keyof Theme['typography'];
};
const Text = styled.div<TextProps>`
  font-family: ${({ variant = 'h5', theme }) => theme.typography[variant].font};
  font-size: ${({ variant = 'h5', theme }) => theme.typography[variant].size}px;
`;
export const BridgeEventItem: React.FC<BridgeEventItemProps> = ({ closeAt, openAt }) => {
  return (
    <Item>
      <Text>
        {dayjs(closeAt).isTomorrow()
          ? 'Demain '
          : dayjs(closeAt).isToday()
          ? "Aujourd'hui "
          : fr.weekDays[Number(dayjs(closeAt).format('d'))] +
            ' ' +
            dayjs(closeAt).format('DD') +
            ' ' +
            fr.month[dayjs(closeAt).month()] +
            ' '}
      </Text>
      <Text>
        {dayjs(closeAt).hour()}h{dayjs(closeAt).format('mm')}
      </Text>
      <Text>
        {dayjs(openAt).hour()}h{dayjs(openAt).format('mm')}
      </Text>
    </Item>
  );
};
