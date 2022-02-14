import type { MetaFunction } from 'remix';
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from 'remix';
import styles from '~/styles/root.css';
import tailwind from './tailwind.css';

export const meta: MetaFunction = () => {
  return { title: 'Mon pont chaban' };
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
export default function App() {
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width,initial-scale=1' />
        <meta name='description' content='Les horaires de fermeture du pont Chaban Delmas' />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  );
}
