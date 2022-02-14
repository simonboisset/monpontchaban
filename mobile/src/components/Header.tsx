import { fr } from 'const/translation';
import React from 'react';
import { TouchableOpacity } from 'react-native';
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

const Text = styled.Text`
  flex: 1;
  text-align: center;
  font-family: ${({ theme }) => theme.typography.h2.font};
  font-size: ${({ theme }) => theme.typography.h2.size}px;
  color: ${({ theme }) => theme.colors.white.main};
`;

export const Header: React.FC<{ onToggleNotifications: () => void; enableNotifications: boolean }> = ({
  onToggleNotifications,
  enableNotifications,
}) => {
  return (
    <Container>
      <SafeAreaView
        edges={['top']}
        style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingRight: 24, paddingLeft: 24 }}
      >
        <FakeIcon />
        <Text>{fr.MyChaban}</Text>
        <TouchableOpacity onPress={onToggleNotifications}>
          {enableNotifications ? <Notification /> : <NotificationOFF />}
        </TouchableOpacity>
      </SafeAreaView>
    </Container>
  );
};
