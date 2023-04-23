import { lezoAlertApi } from '@lezo-alert/sdk';
import { useToken } from './pushTokenContext';
import { useError } from './useError';

export const useIsSubscribeWithoutAuth = () => {
  const { setError } = useError();
  const { token } = useToken();
  const { data, isLoading } = lezoAlertApi.chabanSubscriptions.isSubscribedFromChabanWithoutAuth.useQuery(
    { token },
    {
      onError: () => {
        setError('Un problème est survenu, veuillez réessayer ultérieurement');
      },
    },
  );
  return { isSubscribed: data, isSubscribedLoading: isLoading, token };
};
