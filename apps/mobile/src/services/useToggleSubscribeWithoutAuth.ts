import { lezoAlertApi } from '@chaban/sdk';
import { useQueryClient } from '@tanstack/react-query';
import { getQueryKey } from '@trpc/react-query';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { toast } from '../ui/useToast';
import { useIsSubscribeWithoutAuth } from './useIsSubscribeWithoutAuth';

export const useToggleSubscribeWithoutAuth = () => {
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
        toast({ title: 'Un problème est survenu, veuillez réessayer ultérieurement' });
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
        toast({ title: 'Un problème est survenu, veuillez réessayer ultérieurement' });
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
          toast({ title: "Il semble qu'il y ait un problème avec votre appareil, veuillez réessayer ultérieurement" });
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
            toast({ title: 'Vous devez autoriser les notifications pour vous inscrire' });
            return;
          }
          const token = (await Notifications.getExpoPushTokenAsync()).data;
          setToken(token);
          await subscribeToChabanWithoutAuth({ token });
        } else {
          toast({ title: 'Vous devez être sur un appareil pour vous inscrire' });
          return;
        }
      }
    } catch (error) {
      toast({ title: 'Un problème est survenu, veuillez réessayer ultérieurement' });
    }
  };
  return { toggleSubscribeWithoutAuth, isToggleLoading: isLoading };
};
