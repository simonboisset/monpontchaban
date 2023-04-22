import { lezoAlertApi } from '@lezo-alert/sdk';
import { useToken } from './useToken';

export const useIsSubscribeWithoutAuth = () => {
  const token = useToken();
  const { data, isLoading } = lezoAlertApi.chabanSubscriptions.isSubscribedFromChabanWithoutAuth.useQuery({ token });
  return { isSubscribed: data, isSubscribedLoading: isLoading, token };
};
