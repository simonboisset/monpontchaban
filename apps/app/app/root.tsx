import { MetaFunction } from '@remix-run/node';
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import styles from '~/styles/root.css';
import { isDevelopmentMode } from './domain/config/isDevelopmentMode';
import { root } from './domain/root';
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
    {
      rel: 'stylesheet',
      href: tailwind,
    },
  ];
}

export const loader = root;

export default function App() {
  const { theme, toggle } = useDarkMode();
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width,initial-scale=1' />
        <Meta />
        <Links />
        {process.env.NODE_ENV === 'production' && (
          <script defer data-domain='pont-chaban-delmas.com' src='https://plausible.io/js/script.js'></script>
        )}
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
