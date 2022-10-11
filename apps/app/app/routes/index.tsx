import { useLoaderData, useOutletContext } from '@remix-run/react';
import type { BridgeEvent } from '~/components/BridgeEventItem';
import { ScreenView } from '~/components/ScreenView';
import { getSchedules } from '~/domain/schedule/getSchedules';
import type { Theme } from '~/hooks/useDarkMode';

export const loader = getSchedules;

export default function Index() {
  const datas = useLoaderData<BridgeEvent[]>();
  const { toggleTheme, theme } = useOutletContext<{ toggleTheme: () => void; theme: Theme['data'] }>();

  return (
    <ScreenView
      theme={theme}
      toggleTheme={toggleTheme}
      datas={datas.map(({ closeAt, openAt }) => ({ closeAt: new Date(closeAt), openAt: new Date(openAt) }))}
    />
  );
}
