import { LoaderArgs, V2_MetaFunction } from '@remix-run/node';
import { useLoaderData, useOutletContext } from '@remix-run/react';
import dayjs from 'dayjs';
import { ScreenView } from '~/components/ScreenView';
import { remixCaller, remixEnv } from '~/domain/api.server';
import { Theme } from '~/hooks/useDarkMode';

export const loader = async (args: LoaderArgs) => {
  const caller = await remixCaller(args);
  return await caller.alert.getAlerts({ channelIds: [remixEnv.CHABAN_CHANNEL_ID], minDate: new Date() });
};

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  const [firstAlert, secondAlert] = data.map(({ startAt, endAt, channelId, id, title }) => ({
    channelId,
    id,
    title,
    startAt: new Date(startAt),
    endAt: new Date(endAt),
  }));

  return [
    { title: 'Pont Chaban-Delmas : horaires, levées et fermetures à venir' },
    {
      name: 'description',
      content: `Découvrez les horaires d'ouverture et de fermeture du pont Chaban-Delmas de Bordeaux, ainsi que les prochaines dates de levées. 
      Consultez notre page pour savoir si le pont est ouvert ou fermé aujourd'hui. 
      Ne manquez pas les prochaines fermetures, 
      telles que ${firstAlert.title.toLowerCase()} de ${dayjs(firstAlert.startAt).hour()}h${dayjs(
        firstAlert.startAt,
      ).format('mm')} à ${dayjs(firstAlert.endAt).hour()}h${dayjs(firstAlert.endAt).format('mm')} 
      et ${firstAlert.title.toLowerCase()} de ${dayjs(firstAlert.startAt).hour()}h${dayjs(firstAlert.startAt).format(
        'mm',
      )} à ${dayjs(firstAlert.endAt).hour()}h${dayjs(firstAlert.endAt).format('mm')}.`,
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
