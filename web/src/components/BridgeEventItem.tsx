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
  background-color: ${({ theme }) => theme.colors.background.main};
`;

type DotProps = {
  color?: keyof Theme['colors'];
};
const Dot = styled.div<DotProps>`
  border-radius: 16px;
  padding: 3px;
  margin: 8px;
  background-color: ${({ color = 'success', theme }) => theme.colors[color].main};
`;
type TextAlign = 'center' | 'start' | 'end';
type TextProps = {
  variant?: keyof Theme['typography'];
  justify?: TextAlign;
};
const Text = styled.div<TextProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: ${({ justify = 'start' }) => justify};
  font-family: ${({ variant = 'h5', theme }) => theme.typography[variant].font};
  font-size: ${({ variant = 'h5', theme }) => theme.typography[variant].size}px;
  margin-bottom: ${({ variant = 'h5', theme }) => theme.typography[variant].size / 2}px;
`;
export const BridgeEventItem: React.FC<BridgeEventItemProps> = ({ closeAt, openAt }) => {
  return (
    <Item>
      <Text justify="center" variant="h3">
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
        <Dot color="error" />
        {dayjs(closeAt).hour()}h{dayjs(closeAt).format('mm')}
      </Text>
      <Text>
        <Dot />
        {dayjs(openAt).hour()}h{dayjs(openAt).format('mm')}
      </Text>
    </Item>
  );
};
