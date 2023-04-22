import { useLoaderData } from '@remix-run/react';
import { useState } from 'react';
import { RootLoaderData } from '~/root';
import cookie from './cookie';

export const useDarkMode = () => {
  const { data: themeData } = useLoaderData<RootLoaderData>();
  const [theme, setTheme] = useState(themeData);

  const toggle = () =>
    setTheme((prev) => {
      if (prev === 'dark') {
        cookie.document.set('theme', 'light');
        return 'light';
      } else {
        cookie.document.set('theme', 'dark');
        return 'dark';
      }
    });

  return { theme, toggle };
};
