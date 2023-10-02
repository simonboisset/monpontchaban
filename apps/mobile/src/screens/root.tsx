import { isNextWeek, isThisWeek, isToday, isTomorrow } from '@chaban/core';
import { Alert } from '@chaban/sdk';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { Settings } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { H1, H3, View, XStack, YStack } from 'tamagui';
import { BridgeEventItem } from '../components/BridgeEventItem';
import { BridgeStatus } from '../components/BridgeStatus';
import { useChabanAlerts } from '../services/useChabanAlerts';
import { IconButton } from '../ui/IconButton';
import { OpenedLogo } from '../ui/OpenedLogo';
import { Scrollable } from '../ui/Scrollable';

export const bgColors = {
  OPEN: 'success',
  WILL_CLOSE: 'warning',
  CLOSED: 'error',
} as const;

export default function RootPage() {
  const { alerts } = useChabanAlerts();
  const nextAlert = alerts?.[0];

  const todayEvents = alerts?.filter(({ endAt }) => isToday(endAt)) || [];
  const tomorrowEvents = alerts?.filter(({ endAt }) => isTomorrow(endAt)) || [];

  const thisWeekEvents =
    alerts?.filter(({ endAt }) => !isToday(endAt) && !isTomorrow(endAt) && isThisWeek(endAt)) || [];

  const nextWeekEvents = alerts?.filter(({ endAt }) => !isTomorrow(endAt) && isNextWeek(endAt)) || [];

  const laterEvents =
    alerts?.filter(({ endAt }) => !isToday(endAt) && !isTomorrow(endAt) && !isThisWeek(endAt) && !isNextWeek(endAt)) ||
    [];

  useEffect(() => {
    trackEvent('mobile');
  }, []);

  return (
    <View backgroundColor={'$primaryForeground'}>
      <Scrollable gap='$8' px='$4' py='$8'>
        <IconButton Icon={Settings} href={['Settings']} position='absolute' right='$4' top='$12' />
        <H1 color='$primary' textAlign='center' mt={80}>
          Mon Pont Chaban
        </H1>
        <XStack alignItems='center' borderRadius={'$6'} w='100%' my='$8' overflow='hidden' bg='$foregroundTransparent'>
          <View w={120} h={120} bg='$backgroundTransparent' p='$4' borderRadius={'$6'}>
            <OpenedLogo />
          </View>
          <BridgeStatus event={nextAlert} />
        </XStack>
        <EventList events={todayEvents} title="Aujourd'hui" />
        <EventList events={tomorrowEvents} title='Demain' />
        <EventList events={thisWeekEvents} title='Cette semaine' />
        <EventList events={nextWeekEvents} title='La semaine prochaine' />
        <EventList events={laterEvents} title="Dans plus d'une semaine" />
      </Scrollable>
    </View>
  );
}

type EventListProps = { events: Alert[]; title: string };
const EventList = ({ events, title }: EventListProps) => {
  return events.length ? (
    <YStack gap='$2'>
      <H3 color='$primary' textAlign='center' mb='$6'>
        {title}
      </H3>
      {events.map((data) => (
        <BridgeEventItem key={data.id} {...data} />
      ))}
    </YStack>
  ) : null;
};

export async function trackEvent(urlFragment: string) {
  if (!Device.isDevice) return;
  try {
    const HOST = 'pont-chaban-delmas.com';
    const userAgent = (await Constants.getWebViewUserAgentAsync()) || 'unknown';
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const url = 'https://' + HOST + '/' + urlFragment;

    await fetch('https://analytics.lezo.app/api/event', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json', 'User-Agent': userAgent },
      body: JSON.stringify({ name: 'pageview', domain: HOST, url: url }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
  } catch (e) {
    console.info(`Plausible Tracker error to ${urlFragment}: ${e}`);
  }
}
