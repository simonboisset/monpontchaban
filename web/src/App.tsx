import axios from 'axios';
import { BridgeEventItem } from 'components/BridgeEventItem';
import { BridgeStatus } from 'components/BridgeStatus';
import { theme } from 'const';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import React, { useEffect, useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
export type BridgeEvent = { closeAt: Date; openAt: Date };

type Record = {
  fields: {
    date_passage: string;
    fermeture_a_la_circulation: string;
    re_ouverture_a_la_circulation: string;
  };
};

const ScreenContainer = styled.div`
  display: flex;
  background-color: ${({ theme }) => theme.colors.background.main};
`;
const StatusContainer = styled.div`
  display: flex;
  flex: 6;
  padding: 20px 10px 20px 20px;
`;
const EnventsContainer = styled.div`
  display: flex;
  flex: 2;
  flex-direction: column;
  overflow: scroll;
  height: 100vh;
  padding: 0px 20px 0px 10px;
`;
const EnventsPadding = styled.div`
  margin-top: 20px;
`;

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
      <ScreenContainer>
        <StatusContainer>
          <BridgeStatus {...datas[0]} />
        </StatusContainer>
        <EnventsContainer>
          <EnventsPadding>
            {datas.map((data) => (
              <BridgeEventItem key={data.closeAt.getTime()} {...data} />
            ))}
          </EnventsPadding>
        </EnventsContainer>
      </ScreenContainer>
    </ThemeProvider>
  );
};
