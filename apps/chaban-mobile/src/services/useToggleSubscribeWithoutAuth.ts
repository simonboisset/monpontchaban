import { lezoAlertApi } from '@lezo-alert/sdk';
import { useQueryClient } from '@tanstack/react-query';
import { getQueryKey } from '@trpc/react-query';
import { Platform } from 'react-native';
import { useIsSubscribeWithoutAuth } from './useIsSubscribeWithoutAuth';

export const useToggleSubscribeWithoutAuth = () => {
  const { token, isSubscribed } = useIsSubscribeWithoutAuth();
  const queryClient = useQueryClient();
  const { mutateAsync: subscribeToChabanWithoutAuth, isLoading } =
    lezoAlertApi.chabanSubscriptions.subscribeToChabanWithoutAuth.useMutation({
      onMutate: async () => {
        const queryKey = getQueryKey(lezoAlertApi.chabanSubscriptions.isSubscribedFromChabanWithoutAuth);
        await queryClient.cancelQueries({ queryKey });
        const isSubscribedFromChabanWithoutAuth = queryClient.getQueriesData<boolean>(queryKey);
        queryClient.setQueriesData(queryKey, true);

        return { isSubscribedFromChabanWithoutAuth };
      },
      onError: (_, __, context) => {
        const queryKey = getQueryKey(lezoAlertApi.chabanSubscriptions.isSubscribedFromChabanWithoutAuth);
        if (context?.isSubscribedFromChabanWithoutAuth) {
          queryClient.setQueriesData(queryKey, context.isSubscribedFromChabanWithoutAuth);
        }
      },
    });
  const { mutateAsync: unsubscribeFromChabanWithoutAuth } =
    lezoAlertApi.chabanSubscriptions.unsubscribeFromChabanWithoutAuth.useMutation({
      onMutate: async () => {
        const queryKey = getQueryKey(lezoAlertApi.chabanSubscriptions.isSubscribedFromChabanWithoutAuth);
        await queryClient.cancelQueries({ queryKey });
        const isSubscribedFromChabanWithoutAuth = queryClient.getQueriesData<boolean>(queryKey);
        queryClient.setQueriesData(queryKey, false);

        return { isSubscribedFromChabanWithoutAuth };
      },
      onError: (_, __, context) => {
        const queryKey = getQueryKey(lezoAlertApi.chabanSubscriptions.isSubscribedFromChabanWithoutAuth);
        if (context?.isSubscribedFromChabanWithoutAuth) {
          queryClient.setQueriesData(queryKey, context.isSubscribedFromChabanWithoutAuth);
        }
      },
    });

  const toggleSubscribeWithoutAuth = async () => {
    if (!token) {
      return;
    }
    if (isSubscribed) {
      await unsubscribeFromChabanWithoutAuth({ token });
    } else {
      await subscribeToChabanWithoutAuth({ token, os: Platform.OS === 'android' ? 'ANDROID' : 'IOS' });
    }
  };
  return { toggleSubscribeWithoutAuth, isToggleLoading: isLoading };
};
