import { useCurrentStatus } from '@chaban/core';
import * as MailComposer from 'expo-mail-composer';
import { Bell, BellOff, Mail, Share2, StarIcon, Undo2 } from 'lucide-react-native';
import React, { ReactNode } from 'react';
import { Linking, Platform, Share } from 'react-native';
import { H4, Text, Theme, View, YStack } from 'tamagui';
import { useChabanAlerts } from '../services/useChabanAlerts';
import { useIsSubscribeWithoutAuth } from '../services/useIsSubscribeWithoutAuth';
import { useToggleSubscribeWithoutAuth } from '../services/useToggleSubscribeWithoutAuth';
import { Button } from '../ui/Button';
import { IconButton } from '../ui/IconButton';
import { Scrollable } from '../ui/Scrollable';
import { toast } from '../ui/useToast';
import { bgColors } from './root';

export default function Settings() {
  const { alerts } = useChabanAlerts();

  const { isSubscribed, isSubscribedLoading } = useIsSubscribeWithoutAuth();
  const { toggleSubscribeWithoutAuth, isToggleLoading } = useToggleSubscribeWithoutAuth();
  const status = useCurrentStatus(alerts?.[0]?.startAt, alerts?.[0]?.endAt);

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
    <Theme name={bgColors[status]}>
      <View backgroundColor={'$primaryForeground'}>
        <Scrollable gap='$8' px='$4' py='$20'>
          <IconButton Icon={Undo2} href={['Root']} position='absolute' left='$4' top='$12' />
          <SettingItem
            tittle='Notifications'
            description={
              isSubscribed
                ? 'Les notifications sont actuellement activées. Pour les désactiver appuyez sur le bouton ci-dessous.'
                : 'Les notifications sont actuellement désactivées. Pour les activer appuyez sur le bouton ci-dessous.'
            }>
            <Button
              onPress={toggleSubscribeWithoutAuth}
              label={isSubscribed ? 'Désactiver' : 'Activer'}
              loading={isToggleLoading || isSubscribedLoading}
              LeftIcon={isSubscribed ? Bell : BellOff}
            />
          </SettingItem>
          <SettingItem
            tittle='Notez nous'
            description={`Vous aimez l'application ? Notez la sur ${
              Platform.OS == 'android' ? 'le Play' : "l'App"
            } Store en cliquant sur le bouton ci-dessous.`}>
            <Button onPress={onpenStoreReview} label="Noter l'application" LeftIcon={StarIcon} />
          </SettingItem>
          <SettingItem
            tittle='Partagez à vos amis'
            description="Vous aimez l'application ? Partagez la à vos amis en cliquant sur le bouton ci-dessous.">
            <Button onPress={shareApp} label="Partager l'application" LeftIcon={Share2} />
          </SettingItem>
          <SettingItem
            tittle='Faites nous un retour'
            description="Vous avez des suggestions d'amélioration ou des bugs à nous signaler ? Ecrivez nous un email">
            <Button onPress={sendEmail} label='Nous contacter' LeftIcon={Mail} />
          </SettingItem>
        </Scrollable>
      </View>
    </Theme>
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
      {!!description && <Text color='$primary'>{description}</Text>}
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
