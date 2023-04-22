import { Alert } from '@lezo-alert/sdk';
import { Link, Stack } from 'expo-router';
import React, { useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Easing,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Text,
  View,
  ViewProps,
  useColorScheme,
} from 'react-native';
import styled from 'styled-components/native';
import {
  Status,
  fr,
  isNextWeek,
  isThisWeek,
  isToday,
  isTomorrow,
  useCurrentStatus,
} from '../../../packages/chaban-core/dist';
import { BridgeEventItem } from '../src/components/BridgeEventItem';
import { BridgeStatus } from '../src/components/BridgeStatus';
import SettingsIcon from '../src/components/SettingsIcon';
import { Theme } from '../src/const/theme';
import { useChabanAlerts } from '../src/services/useChabanAlerts';

type ScreenContainerProps = {
  color?: keyof Theme['colors'];
  dark: boolean;
};
const ScreenContainer = styled.View<ScreenContainerProps & ViewProps>`
  flex: 1;
  flex-direction: column;
  background-color: ${({ dark, color = 'success', theme }) =>
    dark ? theme.colors[color].dark : theme.colors[color].main};
`;

const StatusContainer = styled.View`
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  align-items: center;
  justify-content: center;
`;

const colorPicker: Record<Status, keyof Theme['colors']> = {
  OPEN: 'success',
  WILL_CLOSE: 'warning',
  CLOSED: 'error',
};
const windowHeight = Dimensions.get('window').height;

export default function ScreenView() {
  const { alerts, isAlertsLoading } = useChabanAlerts();
  const colorScheme = useColorScheme();
  const dark = colorScheme === 'dark';
  const status = useCurrentStatus(alerts?.[0]?.startAt, alerts?.[0]?.endAt);
  const offset = useRef(new Animated.Value(0)).current;
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    Animated.event([{ nativeEvent: { contentOffset: { y: offset } } }], { useNativeDriver: false })(event);
  };

  const opacity = offset.interpolate({
    inputRange: [0, 200],
    outputRange: [1, 0],
    extrapolate: 'clamp',
    easing: Easing.quad,
  });

  const translateY = offset.interpolate({
    inputRange: [0, 200],
    outputRange: [0, 10],
    extrapolate: 'clamp',
    easing: Easing.cubic,
  });
  const todayEvents = alerts?.filter(({ endAt }) => isToday(endAt)) || [];
  const tomorrowEvents = alerts?.filter(({ endAt }) => isTomorrow(endAt)) || [];
  const thisWeekEvents =
    alerts?.filter(({ endAt }) => !isToday(endAt) && !isTomorrow(endAt) && isThisWeek(endAt)) || [];
  const nextWeekEvents = alerts?.filter(({ endAt }) => !isTomorrow(endAt) && isNextWeek(endAt)) || [];
  const laterEvents =
    alerts?.filter(({ endAt }) => !isToday(endAt) && !isTomorrow(endAt) && !isThisWeek(endAt) && !isNextWeek(endAt)) ||
    [];
  return (
    <ScreenContainer dark={dark} color={colorPicker[status]}>
      <Stack.Screen
        options={{
          animation: 'slide_from_left',
          header: () => (
            <HeaderContainer dark={dark} status={status}>
              <HeaderTitle dark={dark}>{fr.MyChaban}</HeaderTitle>
              {isAlertsLoading ? (
                <ActivityIndicator color='white' />
              ) : (
                <Link href='/settings'>
                  <SettingsIcon dark={dark} />
                </Link>
              )}
            </HeaderContainer>
          ),
        }}
      />
      <StatusContainer>
        <Animated.View
          style={{
            opacity,
            transform: [{ translateY }],
          }}>
          <BridgeStatus dark={dark} event={alerts?.[0]} />
        </Animated.View>
      </StatusContainer>

      <ScrollView onScroll={handleScroll} contentContainerStyle={{ paddingTop: windowHeight - 240 }}>
        <EventList dark={dark} events={todayEvents} title="Aujourd'hui" />
        <EventList dark={dark} events={tomorrowEvents} title='Demain' />
        <EventList dark={dark} events={thisWeekEvents} title='Cette semaine' />
        <EventList dark={dark} events={nextWeekEvents} title='La semaine prochaine' />
        <EventList dark={dark} events={laterEvents} title="Dans plus d'une semaine" />
      </ScrollView>
    </ScreenContainer>
  );
}

type EventListProps = { events: Alert[]; title: string; dark: boolean };
const EventList = ({ events, title, dark }: EventListProps) => {
  return events.length ? (
    <View
      style={{
        paddingTop: 20,
        paddingLeft: 20,
        paddingRight: 20,
      }}>
      <Text
        style={{
          color: dark ? 'black' : 'white',
          fontSize: 20,
          fontWeight: '700',
          paddingLeft: 10,
          paddingBottom: 10,
        }}>
        {title}
      </Text>
      {events.map((data) => (
        <BridgeEventItem dark={dark} key={data.startAt.getTime()} {...data} />
      ))}
    </View>
  ) : null;
};

const HeaderTitle = styled.Text<{ dark: boolean }>`
  flex: 1;
  font-family: ${({ theme }) => theme.typography.h2.font};
  font-size: ${({ theme }) => theme.typography.h2.size}px;
  color: ${({ theme, dark }) => (dark ? theme.colors.background.main : 'white')};
`;

const HeaderContainer = styled.View<{ dark: boolean; status: 'OPEN' | 'WILL_CLOSE' | 'CLOSED' }>`
  flex-direction: row;
  background-color: ${({ theme, dark, status }) =>
    dark ? theme.colors[colorPicker[status]].main : theme.colors[colorPicker[status]].dark};
  align-items: flex-end;
  height: 72px;
  padding: 0px 12px 12px 12px;
`;
