import { useCurrentStatus } from '@chaban/chaban-core';
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
import { useEffect } from 'react';
import styles from '~/globals.css';
import { init, trackEvent } from './aptabase';
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
  return [{ rel: 'stylesheet', href: styles }];
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
    headers: {
      'Cache-Control': 'public, max-age=43200, s-maxage=43200',
    },
  });
};

type UnTypedResponse<R> = R extends TypedResponse<infer U> ? U : never;

export type RootLoaderData = UnTypedResponse<Awaited<ReturnType<typeof loader>>>;
export default function App() {
  const { pathname } = useLocation();
  const urlParams = useParams();
  const { data: themeData, alerts, ENV } = useLoaderData<RootLoaderData>();
  const futureAlerts = alerts.filter((a) => new Date(a.startAt) > new Date());
  const nextAlert = futureAlerts[0];
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
        alerts={futureAlerts.map((a) => ({ ...a, startAt: new Date(a.startAt), endAt: new Date(a.endAt) }))}>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        {isDevelopmentMode() && <LiveReload />}
      </ThemeProvider>
    </html>
  );
}
