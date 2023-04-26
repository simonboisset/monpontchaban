import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';
import { useChabanAlerts } from './useChabanAlerts';

export const useRootData = () => {
  const { isAlertsLoading } = useChabanAlerts();
  const [fontsLoaded] = useFonts({
    Roboto: require('../../assets/fonts/Roboto-Regular.ttf'),
    RobotoBold: require('../../assets/fonts/Roboto-Bold.ttf'),
  });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!isAlertsLoading && fontsLoaded) {
      setIsReady(true);
    }
  }, [isAlertsLoading, fontsLoaded]);

  return { isReady };
};
