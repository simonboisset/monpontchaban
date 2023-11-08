import { lezoAlertApi } from '@chaban/sdk';
import { useFonts } from 'expo-font';
import * as Notifications from 'expo-notifications';
import { createContext, useContext, useEffect, useState } from 'react';
import * as Sentry from 'sentry-expo';
import { usePushToken } from './pushTokenContext';
import { useAuthToken } from './secure-store';
import { useChabanAlerts } from './useChabanAlerts';

export const useRootData = () => {
  const { isAlertsLoading, alerts } = useChabanAlerts();
  const [fontsLoaded] = useFonts({
    Roboto: require('../../assets/fonts/Roboto-Regular.ttf'),
    RobotoBold: require('../../assets/fonts/Roboto-Bold.ttf'),
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });
  useCheckPushToken();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!isAlertsLoading && fontsLoaded) {
      clearAllNotifications();
      setIsReady(true);
    }
  }, [isAlertsLoading, fontsLoaded]);

  return { isReady, alerts };
};

export const RootContext = createContext({} as ReturnType<typeof useRootData>);

export const useRootContext = () => {
  return useContext(RootContext);
};

const clearAllNotifications = async () => {
  const permissions = await Notifications.getPermissionsAsync();
  if (permissions.status !== 'granted') {
    return;
  }
  await Notifications.setBadgeCountAsync(0);
  await Notifications.cancelAllScheduledNotificationsAsync();
};

const useCheckPushToken = () => {
  const { token } = usePushToken();
  const { authToken } = useAuthToken();
  const { mutate } = lezoAlertApi.notifications.updatePushToken.useMutation();

  useEffect(() => {
    if (!token || !authToken) {
      return;
    }
    mutate(
      { pushToken: token },
      {
        onError: (err) => {
          Sentry.Native.captureException(err);
        },
      },
    );
  }, [!token, !authToken]);
};
