import { lezoAlertApi } from '@chaban/sdk';
import { toast } from '../ui/useToast';
import { useToken } from './pushTokenContext';

export const useIsSubscribeWithoutAuth = () => {
  const { token, setToken } = useToken();
  const { data, isLoading } = lezoAlertApi.chabanSubscriptions.isSubscribedFromChabanWithoutAuth.useQuery(
    { token },
    {
      onError: () => {
        toast({ title: 'Un problème est survenu, veuillez réessayer ultérieurement' });
      },
    },
  );
  return { isSubscribed: data, isSubscribedLoading: isLoading, token, setToken };
};
