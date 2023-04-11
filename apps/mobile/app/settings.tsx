import { Status, useCurrentStatus } from 'core';
import * as MailComposer from 'expo-mail-composer';
import { Link, Stack } from 'expo-router';
import React, { ReactNode, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  Linking,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Share,
  TouchableOpacity,
  View,
  ViewProps,
  useColorScheme,
} from 'react-native';
import styled from 'styled-components/native';
import { useRootContext } from '../app/_layout';
import Envelope from '../src/components/Envelope';
import GoBackIcon from '../src/components/GoBackIcon';
import Notification from '../src/components/Notification';
import NotificationOFF from '../src/components/NotificationOFF';
import ShareIcon from '../src/components/Share';
import Star from '../src/components/Star';
import { Theme } from '../src/const/theme';

type ScreenContainerProps = {
  color?: keyof Theme['colors'];
  dark: boolean;
};
const ScreenContainer = styled.View<ScreenContainerProps & ViewProps>`
  flex: 1;
  flex-direction: column;
  background-color: ${({ dark, color = 'success', theme }) =>
    dark ? theme.colors[color].dark : theme.colors[color].main};
`;

const colorPicker: Record<Status, keyof Theme['colors']> = {
  OPEN: 'success',
  WILL_CLOSE: 'warning',
  CLOSED: 'error',
};

export default function Settings() {
  const { datas, enableNotifications, loading, onToggleNotifications, setError } = useRootContext();
  const colorScheme = useColorScheme();
  const dark = colorScheme === 'dark';
  const status = useCurrentStatus(datas[0]?.closeAt, datas[0]?.openAt);
  const offset = useRef(new Animated.Value(0)).current;
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    Animated.event([{ nativeEvent: { contentOffset: { y: offset } } }], { useNativeDriver: false })(event);
  };

  const shareApp = async () => {
    Share.share({
      message: `J'utilise l'application Mon Pont Chaban pour connaitre les horaires de fermeture du pont Chaban-Delmas. Tu peux la télécharger ici: https://play.google.com/store/apps/details?id=${androidPackageName}`,
    });
  };

  const sendEmail = async () => {
    const isAvailable = await MailComposer.isAvailableAsync();
    if (!isAvailable) {
      setError("Impossible d'ouvrir votre client de messagerie");
      return;
    }

    await MailComposer.composeAsync({
      recipients: ['support@lezo.dev'],
      subject: 'Demande: Mon Pont Chaban',
      body: 'Bonjour, je souhaite vous faire part de ',
    });
  };

  return (
    <ScreenContainer dark={dark} color={colorPicker[status]}>
      <Stack.Screen
        options={{
          animation: 'slide_from_right',
          header: () => (
            <HeaderContainer dark={dark} status={status}>
              <Link
                href='/'
                style={{
                  marginRight: 20,
                }}>
                <GoBackIcon dark={dark} />
              </Link>
              <HeaderTitle dark={dark}>Paramètres</HeaderTitle>
            </HeaderContainer>
          ),
        }}
      />

      <ScrollView onScroll={handleScroll} contentContainerStyle={{ paddingLeft: 20, paddingRight: 20 }}>
        <SettingItem
          dark={dark}
          tittle='Notifications'
          description={
            enableNotifications
              ? 'Les notifications sont actuellement activées. Pour les désactiver appuyez sur le bouton ci-dessous.'
              : 'Les notifications sont actuellement désactivées. Pour les activer appuyez sur le bouton ci-dessous.'
          }>
          <Button
            onPress={onToggleNotifications}
            dark={dark}
            label={enableNotifications ? 'Activer' : 'Désactiver'}
            loading={loading}
            icon={enableNotifications ? <Notification dark={dark} /> : <NotificationOFF dark={dark} />}
          />
        </SettingItem>
        <SettingItem
          dark={dark}
          tittle='Notez nous'
          description="Vous aimez l'application ? Notez la sur le Play Store en cliquant sur le bouton ci-dessous.">
          <Button onPress={onpenStoreReview} dark={dark} label="Noter l'application" icon={<Star dark={dark} />} />
        </SettingItem>
        <SettingItem
          dark={dark}
          tittle='Partagez à vos amis'
          description="Vous aimez l'application ? Partagez la à vos amis en cliquant sur le bouton ci-dessous.">
          <Button onPress={shareApp} dark={dark} label="Partager l'application" icon={<ShareIcon dark={dark} />} />
        </SettingItem>
        <SettingItem
          dark={dark}
          tittle='Faites nous un retour'
          description="Vous avez des suggestions d'amélioration ou des bugs à nous signaler ? Ecrivez nous un email">
          <Button onPress={sendEmail} dark={dark} label='Nous contacter' icon={<Envelope dark={dark} />} />
        </SettingItem>
      </ScrollView>
    </ScreenContainer>
  );
}

const HeaderTitle = styled.Text<{ dark: boolean }>`
  flex: 1;
  font-family: ${({ theme }) => theme.typography.h2.font};
  font-size: ${({ theme }) => theme.typography.h2.size}px;
  color: ${({ theme, dark }) => (dark ? theme.colors.background.main : 'white')};
`;

const HeaderContainer = styled.View<{ dark: boolean; status: 'OPEN' | 'WILL_CLOSE' | 'CLOSED' }>`
  flex-direction: row;
  background-color: ${({ theme, dark, status }) =>
    dark ? theme.colors[colorPicker[status]].main : theme.colors[colorPicker[status]].dark};
  align-items: flex-end;
  height: 72px;
  padding: 0px 12px 12px 12px;
`;

const TittleText = styled.Text<{ dark: boolean }>`
  font-family: ${({ theme }) => theme.typography.h2.font};
  font-size: ${({ theme }) => theme.typography.h2.size}px;
  color: ${({ theme, dark }) => (dark ? theme.colors.background.main : 'white')};
  padding-bottom: 12px;
`;
const DescriptionText = styled.Text<{ dark: boolean }>`
  font-family: ${({ theme }) => theme.typography.h3.font};
  font-size: ${({ theme }) => theme.typography.h3.size}px;
  color: ${({ theme, dark }) => (dark ? theme.colors.background.main : 'white')};
  padding-bottom: 8px;
`;
const ButtonText = styled.Text<{ dark: boolean }>`
  flex: 1;
  font-family: ${({ theme }) => theme.typography.h3.font};
  font-size: ${({ theme }) => theme.typography.h3.size}px;
  color: ${({ theme, dark }) => (dark ? theme.colors.background.main : 'white')};
`;
type ButtonProps = {
  dark: boolean;
  label: string;
  onPress: () => void;
  icon?: React.ReactNode;
  loading?: boolean;
};

const Button = ({ dark, label, onPress, loading, icon }: ButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        padding: 8,
      }}>
      <ButtonText dark={dark}>{label}</ButtonText>
      {loading ? <ActivityIndicator color='white' /> : icon}
    </TouchableOpacity>
  );
};

type SettingItemProps = {
  tittle: string;
  description?: string;
  children: ReactNode;
  dark: boolean;
};

const SettingItem = ({ tittle, children, dark, description }: SettingItemProps) => {
  return (
    <View
      style={{
        flexDirection: 'column',
        paddingVertical: 12,
      }}>
      <TittleText dark={dark}>{tittle}</TittleText>
      {!!description && <DescriptionText dark={dark}>{description}</DescriptionText>}
      {children}
    </View>
  );
};

const androidPackageName = 'com.simonboisset.monpontchaban';

const onpenStoreReview = () => {
  Linking.openURL(`market://details?id=${androidPackageName}&showAllReviews=true`);
};
