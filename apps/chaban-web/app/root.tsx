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
import { ScalescopeProvider } from '@scalescope/react';
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

  return (
    <html lang='fr'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width,initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body className={theme}>
        <ScalescopeProvider
          config={{
            url: '/scalescope',
            apiKey: 'fNrsYnoqDBBkBPhRp7RYu605bFiG8kMF',
            appName: 'chaban-web',
            appVersion: ENV.VERSION,
          }}>
          <Outlet context={{ toggleTheme: toggle, theme }} />
        </ScalescopeProvider>
        <ScrollRestoration />
        <Scripts />
        {isDevelopmentMode() && <LiveReload />}
      </body>
    </html>
  );
}
