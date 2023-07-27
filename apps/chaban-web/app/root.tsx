import { LoaderArgs } from '@remix-run/node';
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
import { useAnalytics } from '@scalescope/react';
import { useEffect } from 'react';
import styles from '~/styles/root.css';
import { init, trackEvent } from './aptabase';
import { isDevelopmentMode } from './domain/config/isDevelopmentMode';
import cookie from './hooks/cookie';
import { useDarkMode } from './hooks/useDarkMode';

export const meta: V2_MetaFunction<typeof loader> = () => [
  { title: 'Pont Chaban-Delmas : horaires, levées et fermetures à venir' },
  {
    name: 'description',
    content: `Découvrez les horaires d'ouverture et de fermeture du pont Chaban-Delmas de Bordeaux, ainsi que les prochaines dates de levées. 
      Consultez notre page pour savoir si le pont est ouvert ou fermé aujourd'hui.`,
  },
  { name: 'viewport', content: 'width=device-width,initial-scale=1' },
  { charset: 'utf-8' },
];
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

export const loader = async ({ request }: LoaderArgs) => {
  const packages = require('../package.json');
  return {
    ENV: {
      VERSION: packages.version,
    },
    data: cookie.node.get(request.headers.get('Cookie'), 'theme') || ('light' as 'light' | 'dark'),
  } as { ENV: Record<string, string>; data: 'light' | 'dark' };
};
export type RootLoaderData = ReturnType<typeof loader>;
export default function App() {
  const ENV = useLoaderData<RootLoaderData>().ENV;
  const { theme, toggle } = useDarkMode();
  const { pathname } = useLocation();
  const urlParams = useParams();

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

  const { log, perf } = useAnalytics({
    host: 'https://api.tinybird.co',
    token:
      'p.eyJ1IjogIjlmM2I1ZTJkLTcwNWYtNDlhOS1iMDY3LTNjN2VkNmEyNTBkNyIsICJpZCI6ICI4MmZmNGVlYy1hNTdhLTQwZTAtOTU0Yy1lYzk0Y2UzNzMwZjAifQ.SI7i3KOF-8SFKI1vgFGiIKtm8Brk4wpEUU83Tj8vrAw',
    analyticsUrl: '/v0/events?name=analitics',
    clientSessionUrl: '/v0/events?name=clientSession',
    logUrl: '/v0/events?name=log',
    performanceUrl: '/v0/events?name=performance',
    appName: 'chaban-web',
    appVersion: ENV.VERSION,
    env: process.env.NODE_ENV,
  });

  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width,initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body className={theme}>
        <Outlet context={{ toggleTheme: toggle, theme }} />
        <ScrollRestoration />
        <Scripts />
        {isDevelopmentMode() && <LiveReload />}
      </body>
    </html>
  );
}
