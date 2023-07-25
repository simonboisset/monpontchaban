import { init, trackEvent } from '@aptabase/react-native';
import { Status, fr, isNextWeek, isThisWeek, isToday, isTomorrow, useCurrentStatus } from '@lezo-alert/chaban-core';
import { Alert } from '@lezo-alert/sdk';
import dayjs from 'dayjs';
import { Link, Stack } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Easing,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BridgeEventItem } from '../src/components/BridgeEventItem';
import { BridgeStatus } from '../src/components/BridgeStatus';
import SettingsIcon from '../src/components/SettingsIcon';
import { env } from '../src/const/env';
import { Theme, theme } from '../src/const/theme';
import { useChabanAlerts } from '../src/services/useChabanAlerts';

const colorPicker: Record<Status, keyof Theme['colors']> = {
  OPEN: 'success',
  WILL_CLOSE: 'warning',
  CLOSED: 'error',
};
const windowHeight = Dimensions.get('window').height;

const devAlertOrange: Alert = {
  id: '1',
  startAt: dayjs().add(30, 'minute').toDate(),
  endAt: dayjs().add(1, 'hour').toDate(),
  channelId: '1',
  title: 'Orange',
};
const devAlertRed: Alert = {
  id: '1',
  startAt: dayjs().subtract(30, 'minute').toDate(),
  endAt: dayjs().add(1, 'hour').toDate(),
  channelId: '1',
  title: 'Orange',
};

export default function ScreenView() {
  const { alerts, isAlertsLoading } = useChabanAlerts();

  const nextAlert = alerts?.[0];
  const colorScheme = useColorScheme();
  const dark = colorScheme === 'dark';

  const styles = useStyles(nextAlert);
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
  useEffect(() => {
    init('A-EU-5247288806', { appVersion: env.APP_VERSION });
    trackEvent('/mobile');
  }, []);
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          animation: 'slide_from_left',
          header: () => (
            <View style={styles.header}>
              <Text style={styles.headerTitle}>{fr.MyChaban}</Text>
              {isAlertsLoading ? (
                <ActivityIndicator color='white' />
              ) : (
                <Link href='/settings' style={{ width: 24, height: 24 }}>
                  <SettingsIcon dark={dark} />
                </Link>
              )}
            </View>
          ),
        }}
      />
      <View style={styles.statusContainer}>
        <Animated.View
          style={{
            opacity,
            transform: [{ translateY }],
          }}>
          <BridgeStatus dark={dark} event={nextAlert} />
        </Animated.View>
      </View>

      <ScrollView onScroll={handleScroll} contentContainerStyle={styles.scrollView} scrollEventThrottle={16}>
        <EventList dark={dark} events={todayEvents} title="Aujourd'hui" />
        <EventList dark={dark} events={tomorrowEvents} title='Demain' />
        <EventList dark={dark} events={thisWeekEvents} title='Cette semaine' />
        <EventList dark={dark} events={nextWeekEvents} title='La semaine prochaine' />
        <EventList dark={dark} events={laterEvents} title="Dans plus d'une semaine" />
      </ScrollView>
    </View>
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
        <BridgeEventItem dark={dark} key={data.id} {...data} />
      ))}
    </View>
  ) : null;
};

export const useStyles = (nextAlert?: Alert) => {
  const colorScheme = useColorScheme();
  const dark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();
  const status = useCurrentStatus(nextAlert?.startAt, nextAlert?.endAt);
  const color = colorPicker[status];

  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: dark ? theme.colors[color].main : theme.colors[color].dark,
    },
    statusContainer: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      alignItems: 'center',
      justifyContent: 'center',
    },
    header: {
      flexDirection: 'row',
      paddingTop: 12 + insets.top,
      paddingLeft: 12,
      paddingRight: 12,
      paddingBottom: 12,
      backgroundColor: dark ? theme.colors[color].main : theme.colors[color].dark,
    },
    headerTitle: {
      flex: 1,
      fontFamily: theme.typography.h2.font,
      fontSize: theme.typography.h2.size,
      color: dark ? theme.colors.background.main : 'white',
    },
    scrollView: {
      paddingTop: windowHeight - 220 - insets.bottom - insets.top,
    },
  });
};
