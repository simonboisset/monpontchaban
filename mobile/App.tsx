import axios from 'axios';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import React, { useEffect, useState } from 'react';
import { StatusBar, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import styled, { ThemeProvider } from 'styled-components/native';
import { BridgeStatus } from './src/components/BridgeStatus';
import { ScreenView } from './src/components/ScreenView';
import { theme } from './src/const';
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
    };
    fetchData();
  }, []);

  if (!datas) {
    return <View />;
  }

  return (
    <ThemeProvider theme={theme}>
      <SafeAreaProvider>
        <AppContainer>
          <StatusBar barStyle="light-content" translucent={true} backgroundColor={'transparent'} />
          <ScreenView datas={datas}>
            <BridgeStatus {...datas[0]} />
          </ScreenView>
        </AppContainer>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
