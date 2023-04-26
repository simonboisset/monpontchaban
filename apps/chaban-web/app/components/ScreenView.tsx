import { isNextWeek, isThisWeek, isToday, isTomorrow, useCurrentStatus } from '@lezo-alert/chaban-core';
import type { Alert } from '@lezo-alert/db';
import { Link } from '@remix-run/react';
import React, { useSyncExternalStore } from 'react';
import type { Theme } from '~/hooks/useDarkMode';
import { clx } from '~/styles/clx';
import { Android } from './Android';
import { BridgeEventItem } from './BridgeEventItem';
import { BridgeStatus } from './BridgeStatus';
import { Header } from './Header';

type ScreenViewProps = { datas: Alert[]; toggleTheme: () => void; theme: Theme };

export const ScreenView: React.FC<ScreenViewProps> = ({ datas, toggleTheme, theme }) => {
  const status = useCurrentStatus(datas[0]?.startAt, datas[0]?.endAt);
  const opacity = useScroll();

  const { laterAlerts, nextWeekAlerts, thisWeekAlerts, todayAlerts, tomorrowAlerts } = groupAlertsByDate(datas);

  return (
    <main
      className={clx(
        status === 'OPEN'
          ? 'bg-green dark:bg-greenDark'
          : status === 'WILL_CLOSE'
          ? 'bg-orange dark:bg-orangeDark'
          : 'bg-red dark:bg-redDark',
        'dark:text-gray-400 text-white w-full flex flex-col pt-2 gap-4 px-4 pb-8 items-end',
      )}>
      <Header theme={theme} toggleTheme={toggleTheme} />
      <div
        className={clx(
          'fixed top-1/3 left-0 lg:right-1/3 right-0 flex justify-center items-center flex-col transition-opacity duration-500 ease-in-out lg:opacity-100',
          opacity ? 'opacity-100' : 'opacity-0',
        )}>
        <BridgeStatus event={datas[0]} />
        <h4 className='text-center mt-4'>L'application est disponible sur iOS et Android</h4>
        <div className='flex flex-row gap-4 mt-2'>
          <Link
            to='https://apps.apple.com/app/mon-pont-chaban/id6448217836'
            className='flex flex-row items-center text-sm gap-2 px-2 py-1 bg-gray-700 bg-opacity-10 rounded hover:bg-opacity-20 transition-all font-thin text-white dark:text-gray-400'>
            <span>iOS</span>
            <div className='h-4 w-4 mb-1'>
              <AppleLogo />
            </div>
          </Link>
          <Link
            to='https://play.google.com/store/apps/details?id=com.simonboisset.monpontchaban'
            className='flex flex-row items-center text-sm gap-2 px-2 py-1 bg-gray-700 bg-opacity-10 rounded hover:bg-opacity-20 transition-all font-thin text-white dark:text-gray-400'>
            <span>Android</span>
            <div className='h-4 w-4'>
              <Android />
            </div>
          </Link>
        </div>
      </div>
      <div className='w-full lg:max-w-sm flex flex-col gap-4'>
        <div className='h-screen lg:h-56 -mb-48 lg:mb-0 ' />
        <EventList events={todayAlerts} title='Aujourd’hui' />
        <EventList events={tomorrowAlerts} title='Demain' />
        <EventList events={thisWeekAlerts} title='Cette semaine' />
        <EventList events={nextWeekAlerts} title='La semaine prochaine' />
        <EventList events={laterAlerts} title="Dans plus d'une semaine" />
        <div className='flex flex-col lg:flex-row gap-4 text-greenDark font-thin text-xs dark:text-green lg:fixed lg:bottom-2 lg:left-2'>
          <Link to='/docs/legal'>Mentions légales</Link>
          <Link to='/docs/privacy'>Politique de confidentialité</Link>
        </div>
      </div>
    </main>
  );
};

type EventListProps = { events: Alert[]; title: string };
const EventList = ({ events, title }: EventListProps) => {
  return events.length ? (
    <div className='flex flex-col space-y-2 z-20'>
      <h2 className='text-2xl font-bold pl-4 text-white'>{title}</h2>
      {events.map((data) => (
        <BridgeEventItem key={data.id} {...data} />
      ))}
    </div>
  ) : null;
};

function subscribe(callback: (e: Event) => void) {
  window.addEventListener('scroll', callback);

  return () => {
    window.removeEventListener('scroll', callback);
  };
}

const getServerSnapshot = () => {
  return true;
};

const useScroll = () => {
  const scrollY = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return scrollY;
};

function getSnapshot() {
  return window.scrollY > 100 ? false : true;
}

const AppleLogo = () => (
  <svg viewBox='-1.5 0 20 20'>
    <g stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
      <g transform='translate(-102.000000, -7439.000000)' fill='currentColor'>
        <g transform='translate(56.000000, 160.000000)'>
          <path d='M57.5708873,7282.19296 C58.2999598,7281.34797 58.7914012,7280.17098 58.6569121,7279 C57.6062792,7279.04 56.3352055,7279.67099 55.5818643,7280.51498 C54.905374,7281.26397 54.3148354,7282.46095 54.4735932,7283.60894 C55.6455696,7283.69593 56.8418148,7283.03894 57.5708873,7282.19296 M60.1989864,7289.62485 C60.2283111,7292.65181 62.9696641,7293.65879 63,7293.67179 C62.9777537,7293.74279 62.562152,7295.10677 61.5560117,7296.51675 C60.6853718,7297.73474 59.7823735,7298.94772 58.3596204,7298.97372 C56.9621472,7298.99872 56.5121648,7298.17973 54.9134635,7298.17973 C53.3157735,7298.17973 52.8162425,7298.94772 51.4935978,7298.99872 C50.1203933,7299.04772 49.0738052,7297.68074 48.197098,7296.46676 C46.4032359,7293.98379 45.0330649,7289.44985 46.8734421,7286.3899 C47.7875635,7284.87092 49.4206455,7283.90793 51.1942837,7283.88393 C52.5422083,7283.85893 53.8153044,7284.75292 54.6394294,7284.75292 C55.4635543,7284.75292 57.0106846,7283.67793 58.6366882,7283.83593 C59.3172232,7283.86293 61.2283842,7284.09893 62.4549652,7285.8199 C62.355868,7285.8789 60.1747177,7287.09489 60.1989864,7289.62485'></path>
        </g>
      </g>
    </g>
  </svg>
);

export const groupAlertsByDate = (alerts: Alert[]) => {
  const todayAlerts = alerts.filter(({ endAt }) => isToday(endAt));
  const tomorrowAlerts = alerts.filter(({ endAt }) => isTomorrow(endAt));
  const thisWeekAlerts = alerts.filter(({ endAt }) => !isToday(endAt) && !isTomorrow(endAt) && isThisWeek(endAt));
  const nextWeekAlerts = alerts.filter(({ endAt }) => !isTomorrow(endAt) && isNextWeek(endAt));
  const laterAlerts = alerts.filter(
    ({ endAt }) => !isToday(endAt) && !isTomorrow(endAt) && !isThisWeek(endAt) && !isNextWeek(endAt),
  );
  return { todayAlerts, tomorrowAlerts, thisWeekAlerts, nextWeekAlerts, laterAlerts };
};
