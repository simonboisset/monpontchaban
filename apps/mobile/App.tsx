import { useCurrentStatus } from '@chaban/core';
import { LezoAlertSdkProvider } from '@chaban/sdk';
import { NavigationContainer } from '@react-navigation/native';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import * as Linking from 'expo-linking';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TamaguiProvider, Theme } from 'tamagui';
import { lezoAlertApiClient } from './src/const/api';
import { Navigator } from './src/screens/Navigator';
import { bgColors } from './src/screens/root';
import { PushTokenProvider } from './src/services/pushTokenContext';
import { AsyncStorageProvider } from './src/services/secure-store';
import { RootContext, useRootData } from './src/services/useRootData';
import { ToastProvider } from './src/ui/Toast';
import config from './tamagui.config';

SplashScreen.preventAutoHideAsync();
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const colorScheme = useColorScheme();
  const linking = {
    prefixes: [Linking.createURL('/'), 'https://www.pont-chaban-delmas.com'],
  };
  return (
    <AsyncStorageProvider>
      <NavigationContainer linking={linking}>
        <TamaguiProvider config={config}>
          <Theme name={colorScheme === 'dark' ? 'dark' : 'light'}>
            <SafeAreaProvider>
              <ToastProvider>
                <PushTokenProvider>
                  <LezoAlertSdkProvider client={lezoAlertApiClient} persister={asyncStoragePersister}>
                    <StatusBar
                      barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
                      translucent={true}
                      backgroundColor='transparent'
                    />
                    <SafeLoadedScreen>
                      <Navigator />
                    </SafeLoadedScreen>
                  </LezoAlertSdkProvider>
                </PushTokenProvider>
              </ToastProvider>
            </SafeAreaProvider>
          </Theme>
        </TamaguiProvider>
      </NavigationContainer>
    </AsyncStorageProvider>
  );
}

let cache: Record<string, string> = {};
const CacheStorage = {
  getItem: async (key: string) => {
    return cache[key];
  },
  setItem: async (key: string, value: string) => {
    cache[key] = value;
  },
  removeItem: async (key: string) => {
    delete cache[key];
  },
};
const asyncStoragePersister = createAsyncStoragePersister({
  storage: CacheStorage,
  key: 'lezo-chaban-data',
});

const SafeLoadedScreen = ({ children }: { children: React.ReactNode }) => {
  const { isReady, alerts } = useRootData();
  const [isFirst, setIsFirst] = useState(true);
  const status = useCurrentStatus(alerts?.[0].startAt, alerts?.[0].endAt);
  useEffect(() => {
    if (isReady) {
      setTimeout(() => setIsFirst(false), 1000);
    }
    if (!isReady && isFirst) {
      setIsFirst(false);
      SplashScreen.hideAsync();
    }
  }, [isReady, isFirst]);

  return (
    <RootContext.Provider value={{ alerts, isReady }}>
      <Theme name={bgColors[status]}>{isReady && children}</Theme>
    </RootContext.Provider>
  );
};
