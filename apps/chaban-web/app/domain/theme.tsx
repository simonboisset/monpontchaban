import type { Alert } from '@lezo-alert/api';
import { createContext, useCallback, useContext, useState } from 'react';
import cookie from '~/hooks/cookie';
import { cn } from '~/utils';

export type Theme = 'light' | 'dark';

type ThemeContext = {
  theme: Theme;
  toggle: () => void;
  currentStatus: 'OPEN' | 'WILL_CLOSE' | 'CLOSED';
  alerts: Alert[];
  statusTextColor: string;
};

const ThemeContext = createContext<ThemeContext>({} as ThemeContext);

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme: Theme;
  currentStatus: 'OPEN' | 'WILL_CLOSE' | 'CLOSED';
  alerts: Alert[];
};

export const ThemeProvider = ({ children, defaultTheme, currentStatus, alerts }: ThemeProviderProps) => {
  const [theme, setTheme] = useState(defaultTheme);

  const statusTextColor =
    currentStatus === 'OPEN'
      ? 'text-success-foreground'
      : currentStatus === 'WILL_CLOSE'
      ? 'text-warning-foreground'
      : 'text-error-foreground';

  const toggle = useCallback(() => {
    setTheme((prevTheme) => {
      const nextTheme = prevTheme === 'light' ? 'dark' : 'light';
      cookie.document.set('theme', nextTheme);
      return nextTheme;
    });
  }, []);

  return (
    <body
      className={cn(
        theme,
        statusTextColor,
        'min-h-screen flex flex-col transition-colors duration-500 ease-in-out',
        currentStatus === 'OPEN' ? 'bg-success' : currentStatus === 'WILL_CLOSE' ? 'bg-warning' : 'bg-error',
      )}>
      <ThemeContext.Provider value={{ statusTextColor, theme, toggle, currentStatus, alerts }}>
        {children}
      </ThemeContext.Provider>
    </body>
  );
};

export const useRoot = () => useContext(ThemeContext);
