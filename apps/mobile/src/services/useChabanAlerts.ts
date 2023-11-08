import { lezoAlertApi } from '@chaban/sdk';
import dayjs from 'dayjs';
import { useState } from 'react';
import * as Sentry from 'sentry-expo';
import { toast } from '../ui/useToast';

export const useChabanAlerts = () => {
  const [now] = useState(() => new Date());

  const { data, isLoading } = lezoAlertApi.alert.getAlerts.useQuery(
    {
      channelIds: [],
      minDate: now,
    },
    {
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
      onError: (err) => {
        toast({ title: 'Un problème est survenu, veuillez réessayer ultérieurement' });
        Sentry.Native.captureException(err);
      },
    },
  );

  return { alerts: data?.filter((alert) => dayjs(alert.endAt).isAfter(now)), isAlertsLoading: isLoading };
};
