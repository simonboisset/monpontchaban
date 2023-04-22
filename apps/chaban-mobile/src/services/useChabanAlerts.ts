import { lezoAlertApi } from '@lezo-alert/sdk';
import { useError } from '../../app/_layout';
import { env } from '../const/env';

const now = new Date();

export const useChabanAlerts = () => {
  const { setError } = useError();
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
