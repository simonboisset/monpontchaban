import { useEffect, useState } from 'react';
import { useChabanAlerts } from './useChabanAlerts';

export const useRootData = () => {
  const { alerts, isAlertsLoading } = useChabanAlerts();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!isAlertsLoading) {
      setIsReady(true);
    }
  }, [isAlertsLoading]);

  return { alerts, isAlertsLoading, isReady };
};
