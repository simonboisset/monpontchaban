import { LoaderArgs } from '@remix-run/node';
import { useLoaderData, useOutletContext } from '@remix-run/react';
import { ScreenView } from '~/components/ScreenView';
import { remixCaller, remixEnv } from '~/domain/api.server';
import { Theme } from '~/hooks/useDarkMode';

export const loader = async (args: LoaderArgs) => {
  const caller = await remixCaller(args);
  return await caller.alert.getAlerts({ channelIds: [remixEnv.CHABAN_CHANNEL_ID], minDate: new Date() });
};

export default function Index() {
  const datas = useLoaderData<typeof loader>();
  const { toggleTheme, theme } = useOutletContext<{ toggleTheme: () => void; theme: Theme }>();

  return (
    <ScreenView
      theme={theme}
      toggleTheme={toggleTheme}
      datas={datas.map(({ startAt, endAt, channelId, id, title }) => ({
        channelId,
        id,
        title,
        startAt: new Date(startAt),
        endAt: new Date(endAt),
      }))}
    />
  );
}
