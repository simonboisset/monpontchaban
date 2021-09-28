import { Header } from 'components/Header';
import { Loading } from 'components/Loading';
import { ScreenView } from 'components/ScreenView';
import { api } from 'const/api';
import { theme } from 'const/theme';
import 'dayjs/locale/fr';
import React, { useEffect, useState } from 'react';
import { ThemeProvider } from 'styled-components';
export type BridgeEvent = { closeAt: Date; openAt: Date };

export const App: React.FC = () => {
  const [datas, setDatas] = useState<BridgeEvent[]>();

  useEffect(() => {
    const fetchData = async () => {
      const fetchedDatas = await api.get();
      if (fetchedDatas) {
        setDatas(fetchedDatas.filter((reccord: BridgeEvent) => reccord.openAt.getTime() > new Date().getTime()));
      }
    };

    fetchData();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      {!datas ? (
        <Loading>
          <Header />
        </Loading>
      ) : (
        <ScreenView datas={datas} />
      )}
    </ThemeProvider>
  );
};
