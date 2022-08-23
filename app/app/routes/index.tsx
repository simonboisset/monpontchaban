import { useLoaderData, useOutletContext } from '@remix-run/react';
import { ScreenView } from '~/components/ScreenView';
import { api } from '~/const/api';
import { filterNextBridgeEvents } from '~/const/filterNextBridgeEvents';
import type { Theme } from '~/hooks/useDarkMode';

export const loader = async () => {
  const fetchedDatas = await api.get();
  return fetchedDatas?.filter(filterNextBridgeEvents(new Date().toISOString())) || [];
};

type Data = Awaited<ReturnType<typeof loader>>;

export default function Index() {
  const datas = useLoaderData<Data>();
  const { toggleTheme, theme } = useOutletContext<{ toggleTheme: () => void; theme: Theme }>();

  return <ScreenView theme={theme} toggleTheme={toggleTheme} datas={datas} />;
}
