import { lezoAlertApi } from '@lezo-alert/sdk';

import dayjs from 'dayjs';
import { useState } from 'react';
import { env } from '../const/env';
import { useToken } from './pushTokenContext';
import { useError } from './useError';

export const useChabanAlerts = () => {
  const { setError } = useError();
  const [now] = useState(() => new Date());
  const { today } = useToken();
  const { data, isLoading } = lezoAlertApi.alert.getAlerts.useQuery(
    {
      channelIds: [env.CHABAN_CHANNEL_ID],
      minDate: today,
    },
    {
      onError: () => {
        setError('Un problème est survenu, veuillez réessayer ultérieurement');
      },
    },
  );

  return { alerts: data?.filter((alert) => dayjs(alert.endAt).isAfter(now)), isAlertsLoading: isLoading };
};
