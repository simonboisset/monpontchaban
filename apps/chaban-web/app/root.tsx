import { useCurrentStatus } from '@lezo-alert/chaban-core';
import { DataFunctionArgs } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  MetaFunction,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
  useParams,
} from '@remix-run/react';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import styles from '~/globals.css';
import { init, trackEvent } from './aptabase';
import { remixCaller, remixEnv } from './domain/api.server';
import { isDevelopmentMode } from './domain/config/isDevelopmentMode';
import { ThemeProvider } from './domain/theme';
import cookie from './hooks/cookie';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const [firstAlert, secondAlert] = data?.alerts?.map(({ startAt, endAt, channelId, id, title }) => ({
    channelId,
    id,
    title,
    startAt: new Date(startAt),
    endAt: new Date(endAt),
  })) ?? [null, null];

  return [
    { title: 'Pont Chaban-Delmas : horaires, levées et fermetures à venir' },
    {
      name: 'description',
      content:
        firstAlert && secondAlert
          ? `Découvrez les horaires d'ouverture et de fermeture du pont Chaban-Delmas de Bordeaux, ainsi que les prochaines dates de levées. 
      Consultez notre page pour savoir si le pont est ouvert ou fermé aujourd'hui. 
      Ne manquez pas les prochaines fermetures, telles que ${firstAlert.title.toLowerCase()} le ${dayjs(
        firstAlert.startAt,
      ).format('DD/MM/YYYY')} de ${dayjs(firstAlert.startAt).hour()}h${dayjs(firstAlert.startAt).format(
        'mm',
      )} à ${dayjs(firstAlert.endAt).hour()}h${dayjs(firstAlert.endAt).format(
        'mm',
      )} et ${secondAlert.title.toLowerCase()} le ${dayjs(firstAlert.startAt).format('DD/MM/YYYY')} de ${dayjs(
        secondAlert.startAt,
      ).hour()}h${dayjs(secondAlert.startAt).format('mm')} à ${dayjs(secondAlert.endAt).hour()}h${dayjs(
        secondAlert.endAt,
      ).format('mm')}.`
          : "Découvrez les horaires d'ouverture et de fermeture du pont Chaban-Delmas de Bordeaux, ainsi que les prochaines dates de levées. Consultez notre page pour savoir si le pont est ouvert ou fermé aujourd'hui. Ne manquez pas les prochaines fermetures.",
    },
    { name: 'viewport', content: 'width=device-width,initial-scale=1' },
    { charset: 'utf-8' },
  ];
};
export function links() {
  return [
    {
      rel: 'preconnect',
      href: 'href="https://fonts.googleapis.com',
    },
    {
      rel: 'preconnect',
      href: 'href="https://fonts.gstatic.com',
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap',
    },
    {
      rel: 'stylesheet',
      href: styles,
    },
  ];
}

export const loader = async (args: DataFunctionArgs) => {
  const packages = require('../package.json');
  const caller = await remixCaller(args);

  const alerts = await caller.alert.getAlerts({ channelIds: [remixEnv.CHABAN_CHANNEL_ID], minDate: new Date() });

  return {
    ENV: {
      VERSION: packages.version,
    },
    data: (cookie.node.get(args.request.headers.get('Cookie'), 'theme') || 'light') as 'light' | 'dark',
    alerts,
  };
};
export type RootLoaderData = ReturnType<typeof loader>;
export default function App() {
  const ENV = useLoaderData<RootLoaderData>().ENV;
  const { pathname } = useLocation();
  const urlParams = useParams();
  const { data: themeData, alerts } = useLoaderData<RootLoaderData>();
  const nextAlert = alerts[0];
  const status = nextAlert ? useCurrentStatus(new Date(nextAlert.startAt), new Date(nextAlert.endAt)) : 'OPEN';

  useEffect(() => {
    init('A-EU-5247288806', { appVersion: ENV.VERSION });
  }, []);

  useEffect(() => {
    const pathWithAnonymousParams = pathname
      .split('/')
      .map((part) => {
        for (const key in urlParams) {
          if (part === urlParams[key]) {
            return `:${key}`;
          }
        }
        return part;
      })
      .join('/');
    trackEvent(`/web${pathWithAnonymousParams}`);
  }, [pathname]);

  return (
    <html lang='fr'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width,initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <ThemeProvider
        defaultTheme={themeData}
        currentStatus={status}
        alerts={alerts.map((a) => ({ ...a, startAt: new Date(a.startAt), endAt: new Date(a.endAt) }))}>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        {isDevelopmentMode() && <LiveReload />}
      </ThemeProvider>
    </html>
  );
}
