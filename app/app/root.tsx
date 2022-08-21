import type { LoaderFunction, MetaFunction } from '@remix-run/node';
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import styles from '~/styles/root.css';
import cookie from './hooks/cookie';
import { useDarkMode } from './hooks/useDarkMode';
import tailwind from './styles/tailwind.css';

export const meta: MetaFunction = () => {
  return {
    charset: 'utf-8',
    viewport: 'width=device-width,initial-scale=1',
    title: 'Horaires pont Chaban-Delmas',
    description:
      "Consultez les dates et les horaires d'ouverture et de fermeture du pont Chaban-Delmas de Bordeaux. Pour savoir si le pont Chaban-Delmas est ouvert ou fermé instantanément, la couleur de cette page vous l'indique.",
  };
};
export function links() {
  return [
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap',
    },
    {
      rel: 'stylesheet',
      href: styles,
    },
    {
      rel: 'stylesheet',
      href: tailwind,
    },
  ];
}

export const loader: LoaderFunction = ({ request }) => {
  return cookie.node.get(request.headers.get('Cookie'), 'theme') || 'light';
};

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
        <Outlet context={{ toggleTheme: toggle, theme }} />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  );
}
