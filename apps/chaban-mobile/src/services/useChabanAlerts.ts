import { lezoAlertApi } from '@lezo-alert/sdk';
import { env } from '../const/env';

const now = new Date();

export const useChabanAlerts = () => {
  const { data, isLoading } = lezoAlertApi.alert.getAlerts.useQuery({
    channelIds: [env.CHABAN_CHANNEL_ID],
    minDate: now,
  });

  return { alerts: data, isAlertsLoading: isLoading };
};
