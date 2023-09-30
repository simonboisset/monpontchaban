import { fr } from '@chaban/core';
import { Alert } from '@chaban/sdk';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday.js';
import isTomorrow from 'dayjs/plugin/isTomorrow.js';
import { Ship } from 'lucide-react-native';
import React from 'react';
import { H5, H6, View, XStack, YStack, useTheme } from 'tamagui';
import { ClosedLogo } from '../ui/ClosedLogo';
import { OpenedLogo } from '../ui/OpenedLogo';

type BridgeEventItemProps = Alert;
dayjs.extend(isToday);
dayjs.extend(isTomorrow);

export const BridgeEventItem: React.FC<BridgeEventItemProps> = ({ startAt, endAt, title }) => {
  const { success, error, primary } = useTheme();
  return (
    <YStack borderRadius='$6' mb={4} p='$4' bg='$foregroundTransparent' gap='$4'>
      <XStack gap='$1' flexWrap='wrap' alignItems='center' justifyContent='space-between'>
        <H5 color='$primary' justifyContent='center'>
          {formatEventDate(startAt)}
        </H5>
        <XStack alignItems='center' gap='$2'>
          <Ship size={20} color={primary.val} />
          <H6 color='$primary' textTransform='capitalize' justifyContent='center'>
            {title.toLowerCase()}
          </H6>
        </XStack>
      </XStack>
      <XStack alignItems='center' gap='$6'>
        <XStack alignItems='center' gap='$2'>
          <View w={16} h={16}>
            <ClosedLogo color={error.val} />
          </View>
          <H6 color='$error'>
            {dayjs(startAt).hour()}h{dayjs(startAt).format('mm')}
          </H6>
        </XStack>
        <XStack alignItems='center' gap='$2'>
          <View w={16} h={16}>
            <OpenedLogo color={success.val} />
          </View>
          <H6 color='$success'>
            {dayjs(endAt).hour()}h{dayjs(endAt).format('mm')}
          </H6>
        </XStack>
      </XStack>
    </YStack>
  );
};

const formatEventDate = (date: Date) =>
  dayjs(date).isTomorrow()
    ? 'Demain '
    : dayjs(date).isToday()
    ? "Aujourd'hui "
    : fr.weekDays[Number(dayjs(date).format('d'))] +
      ' ' +
      dayjs(date).format('DD') +
      ' ' +
      fr.month[dayjs(date).month()] +
      ' ';
