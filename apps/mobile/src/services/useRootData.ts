import { useFonts } from 'expo-font';
import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';
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

const clearAllNotifications = async () => {
  const permissions = await Notifications.getPermissionsAsync();
  if (permissions.status !== 'granted') {
    return;
  }
  await Notifications.setBadgeCountAsync(0);
  await Notifications.cancelAllScheduledNotificationsAsync();
};
