import { api } from 'const/api';
import { filterNextBridgeEvents } from 'const/filterNextBridgeEvents';
import { getNotificationPermission } from 'const/notifications';
import { storage } from 'const/storage';
import 'dayjs/locale/fr';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import styled, { ThemeProvider } from 'styled-components/native';
import { ScreenView } from './src/components/ScreenView';
import { theme } from './src/const/theme';

export type BridgeEvent = { closeAt: Date; openAt: Date };

const AppContainer = styled.View`
  flex: 1;
`;

export async function registerForPushNotifications(active = true) {
  const token = await Notifications.getExpoPushTokenAsync();

  return fetch('https://horaires-pont-chaban-delmas.simonboisset.com/notification/subscribe', {
    method: active ? 'POST' : 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
  });
}

export default function App() {
  const [datas, setDatas] = useState<BridgeEvent[]>();
  const [enableNotifications, setEnableNotifications] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        const hasNotification = await storage.hasNotification();
        const hasPermission = await getNotificationPermission(hasNotification);
        const fetchedDatas = await api.get();
        if (fetchedDatas) {
          setDatas(fetchedDatas.filter(filterNextBridgeEvents(new Date())));
        }
        if (hasPermission) {
          const hasTokenSent = await storage.hasPushTokenSent();
          if (hasTokenSent) {
            setEnableNotifications(true);
          } else {
            const sent = await registerForPushNotifications();
            console.log(sent.status, sent.statusText);

            if (sent.status === 200) {
              storage.setPushTokenSent();
              setEnableNotifications(true);
            }
          }
        } else {
          Notifications.cancelAllScheduledNotificationsAsync();
        }
      } catch (error) {}
    };
    fetchData();
  }, []);

  const handleToggleNotifications = async () => {
    try {
      if (enableNotifications) {
        const sent = await registerForPushNotifications(false);
        console.log(sent.status, sent.statusText);
        if (sent.status === 200) {
          setEnableNotifications(false);
          storage.desableNotification();
        }

        Notifications.cancelAllScheduledNotificationsAsync();
      } else {
        const hasPermission = await getNotificationPermission(true);
        if (hasPermission) {
          const sent = await registerForPushNotifications();
          console.log(sent.status, sent.statusText);
          if (sent.status === 200) {
            await storage.setPushTokenSent();
            await storage.enableNotification();
            setEnableNotifications(true);
            Notifications.scheduleNotificationAsync({
              content: {
                title: 'Notifications activées',
                body: `Vous recevrez des notifications lors des prochaines fermetures du pont Chaban-Delmas. Pour désactiver les notifications appuyez de nouveau sur l'icône de notification.`,
              },
              trigger: { seconds: 1 },
            });
          }
        }
      }
    } catch (error) {}
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
