import axios from 'axios';
import { BridgeStatus } from 'components/BridgeStatus';
import { ScreenView } from 'components/ScreenView';
import { theme } from 'const';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import React, { useEffect, useState } from 'react';
import { ThemeProvider } from 'styled-components';
export type BridgeEvent = { closeAt: Date; openAt: Date };

type Record = {
  fields: {
    date_passage: string;
    fermeture_a_la_circulation: string;
    re_ouverture_a_la_circulation: string;
  };
};

export const App: React.FC = () => {
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
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <ScreenView datas={datas}>
        <BridgeStatus {...datas[0]} />
      </ScreenView>
    </ThemeProvider>
  );
};
