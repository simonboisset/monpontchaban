import { BridgeEvent } from 'App';
import { Theme } from 'const/theme';
import { fr } from 'const/translation';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import isTomorrow from 'dayjs/plugin/isTomorrow';
import React from 'react';
import styled from 'styled-components';
import { ClosedLogo } from './ClosedLogo';
import { OpenedLogo } from './OpenedLogo';

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
        <ClosedLogo width={15} color="error" right={8} />
        {dayjs(closeAt).hour()}h{dayjs(closeAt).format('mm')}
      </Text>
      <Text>
        <OpenedLogo width={15} color="success" right={8} />
        {dayjs(openAt).hour()}h{dayjs(openAt).format('mm')}
      </Text>
    </Item>
  );
};
