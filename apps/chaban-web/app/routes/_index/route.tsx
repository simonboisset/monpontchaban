import { LoaderArgs, V2_MetaFunction } from '@remix-run/node';
import { useLoaderData, useOutletContext } from '@remix-run/react';
import dayjs from 'dayjs';
import { ScreenView, groupAlertsByDate } from '~/components/ScreenView';
import { remixCaller, remixEnv } from '~/domain/api.server';
import { Theme } from '~/hooks/useDarkMode';

export const loader = async (args: LoaderArgs) => {
  const caller = await remixCaller(args);
  return await caller.alert.getAlerts({ channelIds: [remixEnv.CHABAN_CHANNEL_ID], minDate: new Date() });
};

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  const { nextWeekAlerts, thisWeekAlerts, todayAlerts, tomorrowAlerts } = groupAlertsByDate(
    data.map(({ startAt, endAt, channelId, id, title }) => ({
      channelId,
      id,
      title,
      startAt: new Date(startAt),
      endAt: new Date(endAt),
    })),
  );
  return [
    { title: 'Pont Chaban | Prochaines levées et fermetures du pont Chaban-Delmas' },
    {
      name: 'description',
      content: `Consultez les dates et les horaires d'ouverture et de fermeture lors des levées du pont Chaban-Delmas de Bordeaux. 
      Pour savoir si le pont Chaban-Delmas est ouvert ou fermé aujourd'hui, la couleur de cette page vous l'indique.\n
      Prochaines fermetures : 
      ${!!todayAlerts.length ? "- Aujourd'hui : " : ''}
      ${todayAlerts
        .map(
          ({ title, startAt, endAt }) =>
            `${title.toLowerCase()} de ${dayjs(startAt).hour()}h${dayjs(startAt).format('mm')} à ${dayjs(
              endAt,
            ).hour()}h${dayjs(endAt).format('mm')}`,
        )
        .join(' | ')}
      ${!!tomorrowAlerts.length ? '- Demain : ' : ''}
      ${tomorrowAlerts
        .map(
          ({ title, startAt, endAt }) =>
            `${title.toLowerCase()} de ${dayjs(startAt).hour()}h${dayjs(startAt).format('mm')} à ${dayjs(
              endAt,
            ).hour()}h${dayjs(endAt).format('mm')}`,
        )
        .join(' | ')}
      ${!!thisWeekAlerts.length ? '- Cette semaine : ' : ''}
      ${thisWeekAlerts
        .map(
          ({ title, startAt, endAt }) =>
            `${title.toLowerCase()} de ${dayjs(startAt).hour()}h${dayjs(startAt).format('mm')} à ${dayjs(
              endAt,
            ).hour()}h${dayjs(endAt).format('mm')}`,
        )
        .join(' | ')}
      ${!!nextWeekAlerts.length ? '- La semaine prochaine : ' : ''}
      ${nextWeekAlerts
        .map(
          ({ title, startAt, endAt }) =>
            `${title.toLowerCase()} de ${dayjs(startAt).hour()}h${dayjs(startAt).format('mm')} à ${dayjs(
              endAt,
            ).hour()}h${dayjs(endAt).format('mm')}`,
        )
        .join(' | ')}
      `,
    },
    { name: 'viewport', content: 'width=device-width,initial-scale=1' },
    { charset: 'utf-8' },
  ];
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
