import { lezoAlertApi } from '@lezo-alert/sdk';

import { env } from '../const/env';
import { useToken } from './pushTokenContext';
import { useError } from './useError';

export const useChabanAlerts = () => {
  const { setError } = useError();
  const { now } = useToken();
  const { data, isLoading } = lezoAlertApi.alert.getAlerts.useQuery(
    {
      channelIds: [env.CHABAN_CHANNEL_ID],
      minDate: now,
    },
    {
      onError: () => {
        setError('Un problème est survenu, veuillez réessayer ultérieurement');
      },
    },
  );

  return { alerts: data, isAlertsLoading: isLoading };
};
