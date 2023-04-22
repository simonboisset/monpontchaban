import { LezoAlertSdkProvider } from '@lezo-alert/sdk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import 'dayjs/locale/fr';
import { Stack } from 'expo-router';
import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import styled, { ThemeProvider } from 'styled-components/native';
import { lezoAlertApiClient } from '../src/const/api';
import { theme } from '../src/const/theme';

export type BridgeEvent = { closeAt: Date; openAt: Date };

const AppContainer = styled.View`
  flex: 1;
`;

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function Layout() {
  return (
    <LezoAlertSdkProvider client={lezoAlertApiClient} persister={asyncStoragePersister}>
      <ThemeProvider theme={theme}>
        <SafeAreaProvider>
          <AppContainer>
            <StatusBar barStyle='light-content' translucent={true} backgroundColor='transparent' />
            <Stack />
          </AppContainer>
        </SafeAreaProvider>
      </ThemeProvider>
    </LezoAlertSdkProvider>
  );
}

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});
