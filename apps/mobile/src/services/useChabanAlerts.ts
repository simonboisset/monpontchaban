import { lezoAlertApi } from '@chaban/sdk';

import dayjs from 'dayjs';
import { useState } from 'react';
import { toast } from '../ui/useToast';

export const useChabanAlerts = () => {
  const [now] = useState(() => new Date());

  const { data, isLoading } = lezoAlertApi.alert.getAlerts.useQuery(
    {
      channelIds: [],
      minDate: now,
    },
    {
      onError: () => {
        toast({ title: 'Un problème est survenu, veuillez réessayer ultérieurement' });
      },
    },
  );

  return { alerts: data?.filter((alert) => dayjs(alert.endAt).isAfter(now)), isAlertsLoading: isLoading };
};
