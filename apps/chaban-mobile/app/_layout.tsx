import { LezoAlertSdkProvider } from '@lezo-alert/sdk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import 'dayjs/locale/fr';
import { Stack } from 'expo-router';
import React, { useContext, useState } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import styled, { ThemeProvider } from 'styled-components/native';
import { AlertDialog } from '../src/components/Alert';
import { lezoAlertApiClient } from '../src/const/api';
import { theme } from '../src/const/theme';
import { PushTokenProvider } from '../src/services/pushTokenContext';

export type BridgeEvent = { closeAt: Date; openAt: Date };

const AppContainer = styled.View`
  flex: 1;
`;

export const unstable_settings = {
  initialRouteName: 'index',
};
type ErrorContextValue = { error: string | undefined; setError: (error: string | undefined) => void };
const ErrorContext = React.createContext({} as ErrorContextValue);
export default function Layout() {
  const [error, setError] = useState<string>();
  return (
    <ErrorContext.Provider value={{ error, setError }}>
      <PushTokenProvider>
        <LezoAlertSdkProvider client={lezoAlertApiClient} persister={asyncStoragePersister}>
          <ThemeProvider theme={theme}>
            <SafeAreaProvider>
              <AppContainer>
                <StatusBar barStyle='light-content' translucent={true} backgroundColor='transparent' />
                <Stack />
                <AlertDialog text={error || ''} visible={!!error} onAnimationEnd={() => setError(undefined)} />
              </AppContainer>
            </SafeAreaProvider>
          </ThemeProvider>
        </LezoAlertSdkProvider>
      </PushTokenProvider>
    </ErrorContext.Provider>
  );
}

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

export const useError = () => {
  const { error, setError } = useContext(ErrorContext);
  return { error, setError };
};
