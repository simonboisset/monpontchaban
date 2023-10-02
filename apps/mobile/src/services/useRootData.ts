import { useFonts } from 'expo-font';
import * as Notifications from 'expo-notifications';
import { createContext, useContext, useEffect, useState } from 'react';
import { useChabanAlerts } from './useChabanAlerts';

export const useRootData = () => {
  const { isAlertsLoading, alerts } = useChabanAlerts();
  const [fontsLoaded] = useFonts({
    Roboto: require('../../assets/fonts/Roboto-Regular.ttf'),
    RobotoBold: require('../../assets/fonts/Roboto-Bold.ttf'),
  });
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
