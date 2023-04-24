import { fr } from '@lezo-alert/chaban-core';
import { Alert } from '@lezo-alert/sdk';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import isTomorrow from 'dayjs/plugin/isTomorrow';
import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { Theme } from '../const/theme';

type BridgeEventItemProps = Alert & { dark: boolean };
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
export const BridgeEventItem: React.FC<BridgeEventItemProps> = ({ startAt, endAt, dark, title }) => {
  return (
    <Item dark={dark}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text dark={dark} justify='center' variant='h3'>
          {dayjs(startAt).isTomorrow()
            ? 'Demain '
            : dayjs(startAt).isToday()
            ? "Aujourd'hui "
            : fr.weekDays[Number(dayjs(startAt).format('d'))] +
              ' ' +
              dayjs(startAt).format('DD') +
              ' ' +
              fr.month[dayjs(startAt).month()] +
              ' '}
        </Text>
        <Text
          style={{
            textTransform: 'capitalize',
            fontWeight: 'bold',
          }}
          dark={dark}
          justify='center'
          variant='h3'>
          {title.toLowerCase()}
        </Text>
      </View>
      <Row>
        <Dot color='error' />
        <Text dark={dark}>
          {dayjs(startAt).hour()}h{dayjs(startAt).format('mm')}
        </Text>
      </Row>
      <Row>
        <Dot />
        <Text dark={dark}>
          {dayjs(endAt).hour()}h{dayjs(endAt).format('mm')}
        </Text>
      </Row>
    </Item>
  );
};
