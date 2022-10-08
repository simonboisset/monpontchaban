import { fr } from 'core';
import React from 'react';
import { ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import Notification from './Notification';
import NotificationOFF from './NotificationOFF';

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  height: 72px;
`;

const FakeIcon = styled.View`
  width: 16px;
`;

const Text = styled.Text<{ dark: boolean }>`
  flex: 1;
  text-align: center;
  font-family: ${({ theme }) => theme.typography.h2.font};
  font-size: ${({ theme }) => theme.typography.h2.size}px;
  color: ${({ theme, dark }) => (dark ? theme.colors.background.main : 'white')};
`;
type HeaderProps = { onToggleNotifications: () => void; enableNotifications: boolean; dark: boolean; loading: boolean };
export const Header: React.FC<HeaderProps> = ({ onToggleNotifications, enableNotifications, dark, loading }) => {
  return (
    <Container>
      <SafeAreaView
        edges={['top']}
        style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingRight: 24, paddingLeft: 24 }}>
        <FakeIcon />
        <Text dark={dark}>{fr.MyChaban}</Text>
        {loading ? (
          <ActivityIndicator color='white' />
        ) : (
          <TouchableOpacity onPress={onToggleNotifications}>
            {enableNotifications ? <Notification dark={dark} /> : <NotificationOFF dark={dark} />}
          </TouchableOpacity>
        )}
      </SafeAreaView>
    </Container>
  );
};
