import { LezoAlertSdkProvider } from '@lezo-alert/sdk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import 'dayjs/locale/fr';
import { SplashScreen, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from 'styled-components/native';
import { AlertDialog } from '../src/components/Alert';
import { lezoAlertApiClient } from '../src/const/api';
import { theme } from '../src/const/theme';
import { PushTokenProvider } from '../src/services/pushTokenContext';
import { ErrorContext } from '../src/services/useError';
import { useRootData } from '../src/services/useRootData';

export type BridgeEvent = { closeAt: Date; openAt: Date };
export const unstable_settings = {
  initialRouteName: 'index',
};

export default function Layout() {
  const [error, setError] = useState<string>();

  return (
    <ErrorContext.Provider value={{ error, setError }}>
      <PushTokenProvider>
        <LezoAlertSdkProvider client={lezoAlertApiClient} persister={asyncStoragePersister}>
          <ThemeProvider theme={theme}>
            <SafeAreaProvider>
              <StatusBar barStyle='light-content' translucent={true} backgroundColor='transparent' />
              <SafeLoadedScreen>
                <Stack />
              </SafeLoadedScreen>
              <AlertDialog text={error || ''} visible={!!error} onAnimationEnd={() => setError(undefined)} />
            </SafeAreaProvider>
          </ThemeProvider>
        </LezoAlertSdkProvider>
      </PushTokenProvider>
    </ErrorContext.Provider>
  );
}

const SafeLoadedScreen = ({ children }: { children: React.ReactNode }) => {
  const { isReady } = useRootData();
  const [isFirst, setIsFirst] = useState(true);

  useEffect(() => {
    if (isReady) {
      setTimeout(() => setIsFirst(false), 1000);
    }
  }, [isReady]);

  return (
    <>
      {(!isReady || isFirst) && <SplashScreen />}
      {isReady && children}
    </>
  );
};
const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'lezo-chaban-data',
});
