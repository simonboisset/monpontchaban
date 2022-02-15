import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from 'const/api';
import { getNotificationPermission, scheduleNewEventNotification } from 'const/notifications';
import 'dayjs/locale/fr';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Sentry from 'sentry-expo';
import styled, { ThemeProvider } from 'styled-components/native';
import { ScreenView } from './src/components/ScreenView';
import { theme } from './src/const/theme';

const sentryDsn: string | undefined = Constants.manifest?.extra?.SENTRY_DSN;
const version: string | undefined = Constants.manifest?.version;
const release: string | undefined = Constants.manifest?.revisionId;
Sentry.init({
  dsn: sentryDsn,
  enableInExpoDevelopment: true,
  debug: false,
  release: process.env.NODE_ENV !== 'development' ? release : 'DEVELOPMENT',
});
Sentry.Native.setTag('version', version);

export type BridgeEvent = { closeAt: Date; openAt: Date };

const AppContainer = styled.View`
  flex: 1;
`;

export default function App() {
  const [datas, setDatas] = useState<BridgeEvent[]>();
  const [enableNotifications, setEnableNotifications] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      const enableNotificationsStorage = await getNotificationPermission();
      const fetchedDatas = await api.get();
      if (fetchedDatas) {
        setDatas(fetchedDatas.filter((reccord: BridgeEvent) => reccord.openAt.getTime() > new Date().getTime()));
      }
      if (enableNotificationsStorage) {
        setEnableNotifications(true);
        scheduleNewEventNotification(fetchedDatas);
      } else {
        Notifications.cancelAllScheduledNotificationsAsync();
      }
      await SplashScreen.preventAutoHideAsync();
    };
    fetchData();
  }, []);

  const handleToggleNotifications = async () => {
    if (enableNotifications) {
      setEnableNotifications(false);
      AsyncStorage.setItem('enable-notifications', 'false');
      Notifications.cancelAllScheduledNotificationsAsync();
    } else {
      const enableNotificationsStorage = await getNotificationPermission();
      if (enableNotificationsStorage) {
        Notifications.scheduleNotificationAsync({
          content: {
            title: 'Notifications activées',
            body: `Vous recevrez des notifications lors des prochaines fermetures du pont Chaban-Delmas. Pour désactiver les notifications appuyez de nouveau sur l'icône de notification.`,
          },
          trigger: { seconds: 1 },
        });
        setEnableNotifications(true);
        AsyncStorage.setItem('enable-notifications', 'true');
        scheduleNewEventNotification(datas);
      }
    }
  };

  const onLayoutRootView = useCallback(async () => {
    if (!!datas) {
      await SplashScreen.hideAsync();
    }
  }, [!!datas]);

  if (!datas) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <SafeAreaProvider>
        <AppContainer onLayout={onLayoutRootView}>
          <StatusBar barStyle="light-content" translucent={true} backgroundColor="transparent" />
          <ScreenView
            onToggleNotifications={handleToggleNotifications}
            enableNotifications={enableNotifications}
            datas={datas}
          />
        </AppContainer>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
