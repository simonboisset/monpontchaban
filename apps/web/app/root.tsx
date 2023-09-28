import { useCurrentStatus } from '@chaban/core';
import { DataFunctionArgs, TypedResponse, json } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  V2_MetaFunction,
  useLoaderData,
  useLocation,
  useParams,
} from '@remix-run/react';
import dayjs from 'dayjs';
import styles from '~/globals.css';
import { remixCaller } from './domain/api.server';
import { isDevelopmentMode } from './domain/config/isDevelopmentMode';
import { ThemeProvider } from './domain/theme';
import cookie from './hooks/cookie';

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  const [firstAlert, secondAlert] = data?.alerts?.map(({ startAt, endAt, id, title }) => ({
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
    { rel: 'preload', href: styles, as: 'style' },
    { rel: 'stylesheet', href: styles },
    { rel: 'alternate icon', type: 'image/png', href: '/favicons/favicon-32x32.png' },
    { rel: 'mask-icon', href: '/favicons/mask-icon.svg' },
    { rel: 'apple-touch-icon', href: '/favicons/apple-touch-icon.png' },
    { rel: 'icon', type: 'image/svg+xml', href: '/favicons/favicon.svg' },
  ].filter(Boolean);
}

export const loader = async (args: DataFunctionArgs) => {
  const packages = require('../package.json');
  const caller = await remixCaller(args.request.headers);
  const alerts = await caller.alert.getAlerts({ channelIds: [], minDate: new Date() });

  const result = {
    ENV: { VERSION: packages.version as string },
    data: (cookie.node.get(args.request.headers.get('Cookie'), 'theme') || 'light') as 'light' | 'dark',
    alerts,
  };

  return json(result, {
    status: 200,
    headers: { 'Cache-Control': 'public, max-age=43200, s-maxage=43200' },
  });
};

type UnTypedResponse<R> = R extends TypedResponse<infer U> ? U : never;

export type RootLoaderData = UnTypedResponse<Awaited<ReturnType<typeof loader>>>;
export default function App() {
  const { pathname } = useLocation();
  const urlParams = useParams();
  const { data: themeData, alerts, ENV } = useLoaderData<RootLoaderData>();
  const futureAlerts = alerts.filter((a) => new Date(a.endAt) > new Date());
  const nextAlert = futureAlerts[0];
  const status = nextAlert ? useCurrentStatus(new Date(nextAlert.startAt), new Date(nextAlert.endAt)) : 'OPEN';

  return (
    <html lang='fr'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width,initial-scale=1' />
        <Meta />
        <Links />
        <script defer data-domain='pont-chaban-delmas.com' src='https://analytics.lezo.app/js/script.js'></script>
      </head>
      <ThemeProvider
        defaultTheme={themeData}
        currentStatus={status}
        alerts={futureAlerts.map((a) => ({ ...a, startAt: new Date(a.startAt), endAt: new Date(a.endAt) }))}>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        {isDevelopmentMode() && <LiveReload />}
      </ThemeProvider>
    </html>
  );
}
