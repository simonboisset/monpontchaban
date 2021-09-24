import axios from 'axios';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import Constants from 'expo-constants';
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Sentry from 'sentry-expo';
import styled, { ThemeProvider } from 'styled-components/native';
import { ScreenView } from './src/components/ScreenView';
import { theme } from './src/const';

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

type Record = {
  fields: {
    date_passage: string;
    fermeture_a_la_circulation: string;
    re_ouverture_a_la_circulation: string;
  };
};

export default function App() {
  const [datas, setDatas] = useState<BridgeEvent[]>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        const req = await axios.get(
          'https://opendata.bordeaux-metropole.fr/api/records/1.0/search/?dataset=previsions_pont_chaban&q=&rows=200&sort=-date_passage&facet=bateau'
        );
        const records: Record[] = req.data.records;
        const parsedDatas = records.map((record) => {
          const date = record.fields.date_passage;
          const [hClose, mClose] = record.fields.fermeture_a_la_circulation
            .split(':')
            .map((value: string) => Number(value));
          const [hOpen, mOpen] = record.fields.re_ouverture_a_la_circulation
            .split(':')
            .map((value: string) => Number(value));

          const closeAt = dayjs(`${date}`, 'YYYY-MM-DD', 'fr').toDate();
          closeAt.setHours(hClose);
          closeAt.setMinutes(mClose);
          const openAt = dayjs(`${date}`, 'YYYY-MM-DD', 'fr').toDate();
          openAt.setHours(hOpen);
          openAt.setMinutes(mOpen);
          return { closeAt, openAt };
        });

        setDatas(parsedDatas.filter((reccord: BridgeEvent) => reccord.openAt.getTime() > new Date().getTime()));
      } catch (error) {
        Sentry.Native.captureException(error);
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
