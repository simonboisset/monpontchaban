import { api } from 'const/api';
import 'dayjs/locale/fr';
import Constants from 'expo-constants';
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Sentry from 'sentry-expo';
import styled, { ThemeProvider } from 'styled-components/native';
import { ScreenView } from './src/components/ScreenView';
import { theme } from './src/const/theme';

const sentryDsn: string | undefined = Constants.manifest?.extra?.SENTRY_DSN;
const version: string | undefined = Constants.manifest?.version;
const release: string | undefined = Constants.manifest?.revisionId;
Sentry.init({
  dsn: sentryDsn,
  enableInExpoDevelopment: true,
  debug: false,
  release: process.env.NODE_ENV !== 'development' ? release : 'DEVELOPMENT',
});
Sentry.Native.setTag('version', version);

export type BridgeEvent = { closeAt: Date; openAt: Date };

const AppContainer = styled.View`
  flex: 1;
`;

export default function App() {
  const [datas, setDatas] = useState<BridgeEvent[]>();

  useEffect(() => {
    const fetchData = async () => {
      await SplashScreen.preventAutoHideAsync();
      const fetchedDatas = await api.get();
      if (fetchedDatas) {
        setDatas(fetchedDatas.filter((reccord: BridgeEvent) => reccord.openAt.getTime() > new Date().getTime()));
      }
    };
    fetchData();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (!!datas) {
      await SplashScreen.hideAsync();
    }
  }, [!!datas]);

  if (!datas) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <SafeAreaProvider>
        <AppContainer onLayout={onLayoutRootView}>
          <StatusBar barStyle="light-content" translucent={true} backgroundColor={'transparent'} />
          <ScreenView datas={datas} />
        </AppContainer>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
