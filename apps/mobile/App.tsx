import { api, filterNextBridgeEvents } from 'core';
import 'dayjs/locale/fr';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Alert from 'src/components/Alert';
import { getNotificationPermission } from 'src/const/notifications';
import { storage } from 'src/const/storage';
import { chabanMonitor } from 'src/monitor';
import styled, { ThemeProvider } from 'styled-components/native';
import { ScreenView } from './src/components/ScreenView';
import { theme } from './src/const/theme';

export type BridgeEvent = { closeAt: Date; openAt: Date };

const AppContainer = styled.View`
  flex: 1;
`;

export async function registerForPushNotifications(active = true) {
  const token = await Notifications.getExpoPushTokenAsync();
  const url = Constants.expoConfig?.extra?.API_URL;

  if (!url) {
    await chabanMonitor().error('[Register Push Notification] Url is not defined');
    throw new Error('[Register Push Notification] Url is not defined');
  }

  try {
    const visitor = await storage.getVisitor();
    await chabanMonitor().request(
      `[Toggle Notification]`,
      visitor,
      `${active ? 'POST' : 'DELETE'} ${url}/notification/subscribe`,
    );
    const response = await fetch(`${url}/notification/subscribe`, {
      method: active ? 'POST' : 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    return response;
  } catch (error) {
    await chabanMonitor().error('[Register Push Notification] Fetch error', `${error}`);
    throw new Error(`[Register Push Notification] Fetch error`);
  }
}

export default function App() {
  const [datas, setDatas] = useState<BridgeEvent[]>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [enableNotifications, setEnableNotifications] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const visitor = await storage.getVisitor();
        await chabanMonitor().request(`[Fetch data] initial fetch`, visitor);
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

            if (sent.status === 200) {
              storage.setPushTokenSent();
              setEnableNotifications(true);
            }
          }
        } else {
          Notifications.cancelAllScheduledNotificationsAsync();
        }
      } catch (error) {
        await chabanMonitor().error('[Fetch data] error', `${error}`);
        setError("Une erreur est survenue lors de la récupération des données. Veulliez redémarrer l'application");
      }
    };
    fetchData();
  }, []);

  const handleToggleNotifications = async () => {
    setLoading(true);
    try {
      if (enableNotifications) {
        const sent = await registerForPushNotifications(false);
        if (sent.status !== 200) {
          throw new Error(`[Desable Notifications] Bad status code ${sent.status}`);
        }

        setEnableNotifications(false);
        storage.desableNotification();
        Notifications.cancelAllScheduledNotificationsAsync();
      } else {
        const hasPermission = await getNotificationPermission(true);
        if (hasPermission) {
          const sent = await registerForPushNotifications();
          if (sent.status !== 200) {
            throw new Error(`[Enable Notifications] Bad status code ${sent.status}`);
          }

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
    } catch (error) {
      await chabanMonitor().error('[Toggle Notifications] error', `${error}`);
      setError('Une erreur est survenue. Veuillez réessayer plus tard.');
    }
    setLoading(false);
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
          <StatusBar barStyle='light-content' translucent={true} backgroundColor='transparent' />
          <ScreenView
            loading={loading}
            onToggleNotifications={handleToggleNotifications}
            enableNotifications={enableNotifications}
            datas={datas}
          />
          <Alert text={error || ''} visible={!!error} onAnimationEnd={() => setError(undefined)} />
        </AppContainer>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
