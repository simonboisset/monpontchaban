import { schedules } from '@chaban/core';
import { ApiParams, ApiResponse, getQueryKey, lezoAlertApi, useQueryClient } from '@chaban/sdk';
import * as MailComposer from 'expo-mail-composer';
import * as Notifications from 'expo-notifications';
import { BellOff, ChevronDown, ChevronUp, Edit, Mail, Plus, Share2, StarIcon, Trash, Undo2 } from 'lucide-react-native';
import React, { ReactNode, useEffect, useState } from 'react';
import { Linking, Platform, Share } from 'react-native';
import { H4, H5, H6, Switch, Text, View, XStack, YStack } from 'tamagui';
import { useToken } from '../services/pushTokenContext';
import { useAuthToken } from '../services/secure-store';
import { useRootNavigation } from '../services/useRootNavigation';
import { Button } from '../ui/Button';
import { IconButton } from '../ui/IconButton';
import { Scrollable } from '../ui/Scrollable';
import { toast } from '../ui/useToast';
import { trackEvent } from './root';

export default function Settings() {
  const { currentDevice, isCurrentDeviceLoading } = useCurrentDevice();
  const { deleteAccount } = useDeleteAccount();
  const { login, isLoginLoading } = useLogin();

  useEffect(() => {
    trackEvent('mobile/settings');
  }, []);

  const shareApp = async () => {
    Share.share({
      message: 'https://pont-chaban-delmas.com/store',
    });
  };

  const sendEmail = async () => {
    const isAvailable = await MailComposer.isAvailableAsync();
    if (!isAvailable) {
      toast({ title: "Impossible d'ouvrir votre client de messagerie", color: 'error' });
      return;
    }

    await MailComposer.composeAsync({
      recipients: ['support@lezo.dev'],
      subject: 'Demande: Mon Pont Chaban',
      body: 'Bonjour, je souhaite vous faire part de ',
    });
  };

  return (
    <View backgroundColor={'$primaryForeground'}>
      <Scrollable gap='$8' px='$4' py='$20'>
        <IconButton Icon={Undo2} href={['Root']} position='absolute' left='$4' top='$12' />
        <SettingItem
          tittle='Notifications'
          description={
            currentDevice?.id
              ? 'Vous avez activé les notifications. Vous pouvez les désactiver, les modifier ou en créer de nouvelles en appuyant sur les boutons ci-dessous. Vous pouvez également vous désabonner en appuyant sur le bouton "Supprimer mes données".'
              : 'Les notifications sont actuellement désactivées. Pour les activer appuyez sur le bouton ci-dessous.'
          }>
          {!currentDevice?.id ? (
            <Button
              onPress={login}
              label={'Activer'}
              loading={isCurrentDeviceLoading || isLoginLoading}
              RightIcon={BellOff}
            />
          ) : (
            <NotificationSection />
          )}
        </SettingItem>
        <SettingItem
          tittle='Notez nous'
          description={`Vous aimez l'application ? Notez la sur ${
            Platform.OS == 'android' ? 'le Play' : "l'App"
          } Store en cliquant sur le bouton ci-dessous.`}>
          <Button onPress={onpenStoreReview} label="Noter l'application" RightIcon={StarIcon} />
        </SettingItem>
        <SettingItem
          tittle='Partagez à vos amis'
          description="Vous aimez l'application ? Partagez la à vos amis en cliquant sur le bouton ci-dessous.">
          <Button onPress={shareApp} label="Partager l'application" RightIcon={Share2} />
        </SettingItem>
        <SettingItem
          tittle='Faites nous un retour'
          description="Vous avez des suggestions d'amélioration ou des bugs à nous signaler ? Ecrivez nous un email">
          <Button onPress={sendEmail} label='Nous contacter' RightIcon={Mail} />
        </SettingItem>
        {!!currentDevice?.id && (
          <SettingItem
            tittle='Supprimer mes données'
            description='En supprimant vos données, vous ne recevrez plus de notifications et vos preferences seront perdues'>
            <Button color='error' label='Supprimer' RightIcon={Trash} onPress={deleteAccount} />
          </SettingItem>
        )}
      </Scrollable>
    </View>
  );
}

type SettingItemProps = {
  tittle: string;
  description?: string;
  children: ReactNode;
};

const SettingItem = ({ tittle, children, description }: SettingItemProps) => {
  return (
    <YStack gap='$4'>
      <H4 color='$primary'>{tittle}</H4>
      {!!description && (
        <Text textAlign='justify' color='$primary'>
          {description}
        </Text>
      )}
      {children}
    </YStack>
  );
};

const androidPackageName = 'com.simonboisset.monpontchaban';
const iosAppId = '6448217836';
const onpenStoreReview = () => {
  Linking.openURL(
    Platform.OS === 'android'
      ? `market://details?id=${androidPackageName}&showAllReviews=true`
      : `itms-apps://itunes.apple.com/app/id${iosAppId}?action=write-review`,
  );
};

const useCurrentDevice = () => {
  const { data, isLoading } = lezoAlertApi.auth.getCurrentDevice.useQuery({});
  return { currentDevice: data, isCurrentDeviceLoading: isLoading };
};

const NotificationSection = () => {
  const { notificationRules, createNotificationRule, isCreating } = useNotificationRules();
  return (
    <YStack gap='$4'>
      {notificationRules?.map((rule) => <NotificationCard key={rule.id} rule={rule} />) || (
        <Text color='$primary'>Vous n'avez pas encore de notification</Text>
      )}
      <Button
        label='Ajouter une notification'
        RightIcon={Plus}
        loading={isCreating}
        onPress={() =>
          createNotificationRule({
            title: '⏰ Alerte Fermeture du pont chaban',
            delayMinBefore: 60,
            scheduleIds: schedules.map(({ id }) => id),
          })
        }
      />
    </YStack>
  );
};

const useLogin = () => {
  const currentDeviceCache = useCurrentDeviceCache();
  const { setAuthToken } = useAuthToken();
  const { mutate, isLoading } = lezoAlertApi.auth.requestLogin.useMutation();
  const { requestToken } = useToken();
  const { mutate: confirmLogin, isLoading: isConfirmLoading } = lezoAlertApi.auth.confirmLogin.useMutation();
  const [isWaitingForConfirm, setIsWaitingForConfirm] = useState(false);

  const login = async () => {
    setIsWaitingForConfirm(true);
    const token = await requestToken();
    if (!token) return;

    mutate({ token });
    setTimeout(async () => {
      const data = await Notifications.getPresentedNotificationsAsync();
      const notifications = JSON.parse(JSON.stringify(data)) as Notifications.Notification[];
      notifications.sort((a, b) => b.date - a.date);
      const confirmToken = notifications[0].request.content.data.confirmToken;
      confirmLogin(
        { confirmToken, pushToken: token },
        {
          onSuccess: ({ authToken, deviceId, pushToken }) => {
            setAuthToken(authToken);
            currentDeviceCache.setCache({ id: deviceId, token: pushToken });
          },
        },
      );
      await Notifications.dismissAllNotificationsAsync();

      setIsWaitingForConfirm(false);
    }, 3000);
  };

  return { login, isLoginLoading: isLoading || isConfirmLoading || isWaitingForConfirm };
};

export const useCurrentDeviceCache = () => {
  const queryClient = useQueryClient();
  const getCache = () => {
    const queryKey = getQueryKey(lezoAlertApi.auth.getCurrentDevice);
    const cacheData = queryClient.getQueriesData<ApiResponse['auth']['getCurrentDevice']>(queryKey);
    const cache = cacheData?.[0]?.[1];
    if (!cache) return null;
    return cache;
  };

  const setCache = (value: ApiResponse['auth']['getCurrentDevice']) => {
    const queryKey = getQueryKey(lezoAlertApi.auth.getCurrentDevice);
    queryClient.setQueriesData<ApiResponse['auth']['getCurrentDevice']>(queryKey, value);
  };

  return { getCache, setCache };
};

export const useDeleteAccount = () => {
  const { mutate, isLoading } = lezoAlertApi.auth.deleteAccount.useMutation();
  const { setCache } = useCurrentDeviceCache();

  const deleteAccount = async () => {
    mutate(
      {},
      {
        onSuccess: () => {
          setCache(null);
        },
      },
    );
  };

  return { deleteAccount, isDeleteAccountLoading: isLoading };
};

export const useNotificationRules = () => {
  const cache = useNotificationRulesCache();
  const { navigate } = useRootNavigation();
  const { data, isLoading } = lezoAlertApi.notificationRule.getNotificationRules.useQuery({});
  const { mutate: update, isLoading: isUpdating } = lezoAlertApi.notificationRule.updateNotificationRule.useMutation();
  const { mutate: create, isLoading: isCreating } = lezoAlertApi.notificationRule.createNotificationRule.useMutation();
  const { mutate: deleteRule } = lezoAlertApi.notificationRule.deleteNotificationRule.useMutation();

  const updateNotificationRule = (params: ApiParams['notificationRule']['updateNotificationRule']) => {
    update(params, {
      onSuccess: (updatedRule) => {
        const cacheData = cache.getCache();
        toast({ title: 'Notification modifiée', color: 'success' });
        cache.setCache(
          cacheData?.map((rule) => (rule.id === updatedRule.id ? { ...rule, ...updatedRule } : rule)) || [],
        );
      },
    });
  };

  const createNotificationRule = (params: ApiParams['notificationRule']['createNotificationRule']) => {
    create(params, {
      onSuccess: (createdRule) => {
        navigate('NotificationRule', { id: createdRule.id });
        const cacheData = cache.getCache();
        cache.setCache([...(cacheData || []), createdRule]);
      },
    });
  };

  const deleteNotificationRule = (params: ApiParams['notificationRule']['deleteNotificationRule']) => {
    deleteRule(params, {
      onSuccess: (deletedRule) => {
        navigate('Settings');
        const cacheData = cache.getCache();
        cache.setCache(cacheData?.filter((rule) => rule.id !== deletedRule.id) || []);
      },
    });
  };

  return {
    notificationRules: data,
    isNotificationRulesLoading: isLoading,
    updateNotificationRule,
    createNotificationRule,
    deleteNotificationRule,
    isUpdating,
    isCreating,
  };
};

const useNotificationRulesCache = () => {
  const queryClient = useQueryClient();
  const getCache = () => {
    const queryKey = getQueryKey(lezoAlertApi.notificationRule.getNotificationRules);
    const cacheData = queryClient.getQueriesData<ApiResponse['notificationRule']['getNotificationRules']>(queryKey);
    const cache = cacheData?.[0]?.[1];
    if (!cache) return null;
    return cache;
  };

  const setCache = (value: ApiResponse['notificationRule']['getNotificationRules']) => {
    const queryKey = getQueryKey(lezoAlertApi.notificationRule.getNotificationRules);
    queryClient.setQueriesData<ApiResponse['notificationRule']['getNotificationRules']>(queryKey, value);
  };

  return { getCache, setCache };
};

const NotificationCard = ({ rule }: { rule: ApiResponse['notificationRule']['getNotificationRules'][0] }) => {
  const { updateNotificationRule, deleteNotificationRule } = useNotificationRules();
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <YStack overflow='hidden' bg='$foregroundTransparent' borderRadius='$6' px='$4' py='$4'>
      <XStack>
        <H5 color='$primary' flex={1}>
          {rule.title}
        </H5>
        <IconButton Icon={isExpanded ? ChevronUp : ChevronDown} onPress={() => setIsExpanded(!isExpanded)} />
      </XStack>
      <YStack maxHeight={isExpanded ? '100%' : '$0'} overflow='hidden' gap='$4'>
        <XStack alignItems='center' gap='$4' pt='$4'>
          <H6 flex={1} color={rule.active ? '$success' : '$error'} animation='lazy'>
            {rule.active ? 'Activée' : 'Désactivée'}
          </H6>
          <Switch
            animation='lazy'
            checked={rule.active}
            p={6}
            bg='$foregroundTransparent'
            borderColor={rule.active ? '$successForegroundTransparent' : '$errorForegroundTransparent'}
            onCheckedChange={() => updateNotificationRule({ id: rule.id, active: !rule.active })}>
            <Switch.Thumb size='$2' bg={rule.active ? '$successForeground' : '$errorForeground'} animation='lazy' />
          </Switch>
        </XStack>
        <Button label='Modifier' RightIcon={Edit} href={['NotificationRule', { id: rule.id }]} />
      </YStack>
    </YStack>
  );
};
