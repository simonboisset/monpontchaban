import { LoaderArgs } from '@remix-run/node';
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, V2_MetaFunction } from '@remix-run/react';
import { Analytics } from '@vercel/analytics/react';
import styles from '~/styles/root.css';
import { isDevelopmentMode } from './domain/config/isDevelopmentMode';
import cookie from './hooks/cookie';
import { useDarkMode } from './hooks/useDarkMode';

export const meta: V2_MetaFunction<typeof loader> = () => [
  { title: 'Mon Pont Chaban' },
  {
    name: 'description',
    content:
      "Consultez les dates et les horaires d'ouverture et de fermeture du pont Chaban-Delmas de Bordeaux. Pour savoir si le pont Chaban-Delmas est ouvert ou fermé instantanément, la couleur de cette page vous l'indique.",
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
  return {
    ENV: {},
    data: cookie.node.get(request.headers.get('Cookie'), 'theme') || ('light' as 'light' | 'dark'),
  } as { ENV: Record<string, string>; data: 'light' | 'dark' };
};
export type RootLoaderData = ReturnType<typeof loader>;
export default function App() {
  const { theme, toggle } = useDarkMode();
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width,initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body className={theme}>
        <Analytics />
        <Outlet context={{ toggleTheme: toggle, theme }} />
        <ScrollRestoration />
        <Scripts />
        {isDevelopmentMode() && <LiveReload />}
      </body>
    </html>
  );
}
