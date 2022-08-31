import { Theme } from 'const/theme';
import { fr } from 'core';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import isTomorrow from 'dayjs/plugin/isTomorrow';
import React from 'react';
import styled from 'styled-components/native';
import { BridgeEvent } from '../../App';
type BridgeEventItemProps = BridgeEvent & { dark: boolean };
dayjs.extend(isToday);
dayjs.extend(isTomorrow);

const Item = styled.View<{ dark: boolean }>`
  flex-direction: column;
  border-radius: 16px;
  margin-bottom: 20px;
  padding: 20px;
  background-color: ${({ theme, dark }) => (dark ? theme.colors.background.dark : 'white')};
`;

type DotProps = {
  color?: keyof Theme['colors'];
};
const Dot = styled.View<DotProps>`
  border-radius: 16px;
  padding: 3px;
  margin: 8px;
  background-color: ${({ color = 'success', theme }) => theme.colors[color].main};
`;
type TextAlign = 'center' | 'flex-start' | 'flex-end';
type TextProps = {
  variant?: keyof Theme['typography'];
  justify?: TextAlign;
};
const Text = styled.Text<TextProps & { dark: boolean }>`
  flex-direction: row;
  align-items: center;
  justify-content: ${({ justify = 'flex-start' }) => justify};
  font-family: ${({ variant = 'h5', theme }) => theme.typography[variant].font};
  font-size: ${({ variant = 'h5', theme }) => theme.typography[variant].size}px;
  margin-bottom: ${({ variant = 'h5', theme }) => theme.typography[variant].size / 2}px;
  color: ${({ theme, dark }) => (dark ? theme.colors.background.light : theme.colors.background.main)};
`;
const Row = styled.View<TextProps>`
  flex-direction: row;
  align-items: center;
  justify-content: ${({ justify = 'flex-start' }) => justify};
`;
export const BridgeEventItem: React.FC<BridgeEventItemProps> = ({ closeAt, openAt, dark }) => {
  return (
    <Item dark={dark}>
      <Text dark={dark} justify="center" variant="h3">
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
      <Row>
        <Dot color="error" />
        <Text dark={dark}>
          {dayjs(closeAt).hour()}h{dayjs(closeAt).format('mm')}
        </Text>
      </Row>
      <Row>
        <Dot />
        <Text dark={dark}>
          {dayjs(openAt).hour()}h{dayjs(openAt).format('mm')}
        </Text>
      </Row>
    </Item>
  );
};
