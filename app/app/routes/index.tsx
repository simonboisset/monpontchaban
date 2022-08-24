import { json } from '@remix-run/node';
import { useLoaderData, useOutletContext } from '@remix-run/react';
import type { BridgeEvent } from '~/components/BridgeEventItem';
import { ScreenView } from '~/components/ScreenView';
import { api } from '~/const/api';
import { filterNextBridgeEvents } from '~/const/filterNextBridgeEvents';
import { redis } from '~/const/redis.server';
import type { Theme } from '~/hooks/useDarkMode';

export const loader = async () => {
  try {
    const redisData = await redis.get('data');
    if (redisData) {
      const data = JSON.parse(redisData);
      if (Array.isArray(data)) {
        return json(data.filter(filterNextBridgeEvents(new Date())) || [], {
          headers: {
            'Cache-Control': 'public, max-age=3600, s-maxage=86400',
          },
        });
      }
    }
  } catch (error) {
    console.error('[Load data] Redis data fails');
  }

  const fetchedDatas = await api.get();
  await redis.set('data', JSON.stringify(fetchedDatas));
  return fetchedDatas?.filter(filterNextBridgeEvents(new Date())) || [];
};

export default function Index() {
  const datas = useLoaderData<BridgeEvent[]>();
  const { toggleTheme, theme } = useOutletContext<{ toggleTheme: () => void; theme: Theme }>();

  return (
    <ScreenView
      theme={theme}
      toggleTheme={toggleTheme}
      datas={datas.map(({ closeAt, openAt }) => ({ closeAt: new Date(closeAt), openAt: new Date(openAt) }))}
    />
  );
}
