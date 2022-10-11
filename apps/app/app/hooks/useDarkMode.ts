import { useLoaderData } from '@remix-run/react';
import { useState } from 'react';
import cookie from './cookie';

export type Theme = { ENV: any; data: 'dark' | 'light' };

export const useDarkMode = () => {
  const { data: themeData } = useLoaderData<Theme>();
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
