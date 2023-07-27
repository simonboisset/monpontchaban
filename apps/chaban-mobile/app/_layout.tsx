import { LezoAlertSdkProvider } from '@lezo-alert/sdk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAnalytics } from '@scalescope/expo';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import 'dayjs/locale/fr';
import { SplashScreen, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from 'styled-components/native';
import { AlertDialog } from '../src/components/Alert';
import { lezoAlertApiClient } from '../src/const/api';
import { env } from '../src/const/env';
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
  const { log, perf } = useAnalytics({
    host: 'https://api.tinybird.co',
    token:
      'p.eyJ1IjogIjlmM2I1ZTJkLTcwNWYtNDlhOS1iMDY3LTNjN2VkNmEyNTBkNyIsICJpZCI6ICI4MmZmNGVlYy1hNTdhLTQwZTAtOTU0Yy1lYzk0Y2UzNzMwZjAifQ.SI7i3KOF-8SFKI1vgFGiIKtm8Brk4wpEUU83Tj8vrAw',
    analyticsUrl: '/v0/events?name=analitics',
    clientSessionUrl: '/v0/events?name=clientSession',
    logUrl: '/v0/events?name=log',
    performanceUrl: '/v0/events?name=performance',
    appName: 'chaban-mobile',
    appVersion: env.APP_VERSION,
    env: process.env.NODE_ENV||'unknown',
  });
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
