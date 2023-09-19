import { lezoAlertApi } from '@chaban/sdk';
import { useQueryClient } from '@tanstack/react-query';
import { getQueryKey } from '@trpc/react-query';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { useError } from './useError';
import { useIsSubscribeWithoutAuth } from './useIsSubscribeWithoutAuth';

export const useToggleSubscribeWithoutAuth = () => {
  const { setError } = useError();
  const { token, isSubscribed, setToken } = useIsSubscribeWithoutAuth();
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
        setError('Un problème est survenu, veuillez réessayer ultérieurement');
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
        setError('Un problème est survenu, veuillez réessayer ultérieurement');
        const queryKey = getQueryKey(lezoAlertApi.chabanSubscriptions.isSubscribedFromChabanWithoutAuth);
        if (context?.isSubscribedFromChabanWithoutAuth) {
          queryClient.setQueriesData(queryKey, context.isSubscribedFromChabanWithoutAuth);
        }
      },
    });

  const toggleSubscribeWithoutAuth = async () => {
    try {
      if (isSubscribed) {
        if (!token) {
          setError("Il semble qu'il y ait un problème avec votre appareil, veuillez réessayer ultérieurement");
          return;
        }
        await unsubscribeFromChabanWithoutAuth({ token });
      } else {
        if (Device.isDevice) {
          const { status: existingStatus } = await Notifications.getPermissionsAsync();
          let finalStatus = existingStatus;
          if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
          }
          if (finalStatus !== 'granted') {
            setError('Vous devez autoriser les notifications pour vous inscrire');
            return;
          }
          const token = (await Notifications.getExpoPushTokenAsync()).data;
          setToken(token);
          await subscribeToChabanWithoutAuth({ token, os: Platform.OS === 'android' ? 'ANDROID' : 'IOS' });
        } else {
          setError('Vous devez être sur un appareil pour vous inscrire');
          return;
        }
      }
    } catch (error) {
      setError('Un problème est survenu, veuillez réessayer ultérieurement');
    }
  };
  return { toggleSubscribeWithoutAuth, isToggleLoading: isLoading };
};
