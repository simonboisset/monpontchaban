import type { MetaFunction } from 'remix';
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from 'remix';
import { ThemeProvider } from 'styled-components';
import { theme } from './const/theme';
import styles from './styles/index.css';
export const meta: MetaFunction = () => {
  return { title: 'Mon pont chaban' };
};

export default function App() {
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width,initial-scale=1' />
        <link href={styles} rel='stylesheet' />
        <link
          href='https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap'
          rel='stylesheet'
        />
        <meta name='description' content='Horaire pont Chaban-Delmas' />
        <Meta />
        <Links />
      </head>
      <body>
        <ThemeProvider theme={theme}>
          <Outlet />
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  );
}
