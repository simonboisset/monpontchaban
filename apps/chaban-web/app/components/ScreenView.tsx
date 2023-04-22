import { isNextWeek, isThisWeek, isToday, isTomorrow, useCurrentStatus } from '@lezo-alert/chaban-core';
import { Link } from '@remix-run/react';
import React, { useSyncExternalStore } from 'react';
import type { Theme } from '~/hooks/useDarkMode';
import { clx } from '~/styles/clx';
import type { BridgeEvent } from './BridgeEventItem';
import { BridgeEventItem } from './BridgeEventItem';
import { BridgeStatus } from './BridgeStatus';
import { Header } from './Header';

type ScreenViewProps = { datas: BridgeEvent[]; toggleTheme: () => void; theme: Theme['data'] };

export const ScreenView: React.FC<ScreenViewProps> = ({ datas, toggleTheme, theme }) => {
  const status = useCurrentStatus(datas[0]?.closeAt, datas[0]?.openAt);
  const opacity = useScroll();

  const todayEvents = datas.filter(({ openAt }) => isToday(openAt));
  const tomorrowEvents = datas.filter(({ openAt }) => isTomorrow(openAt));
  const thisWeekEvents = datas.filter(({ openAt }) => !isToday(openAt) && !isTomorrow(openAt) && isThisWeek(openAt));
  const nextWeekEvents = datas.filter(({ openAt }) => !isTomorrow(openAt) && isNextWeek(openAt));
  const laterEvents = datas.filter(
    ({ openAt }) => !isToday(openAt) && !isTomorrow(openAt) && !isThisWeek(openAt) && !isNextWeek(openAt),
  );

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
      </div>
      <div className='w-full lg:max-w-sm flex flex-col gap-4'>
        <div className='h-screen lg:h-56 -mb-48 lg:mb-0 ' />
        <EventList events={todayEvents} title='Aujourd’hui' />
        <EventList events={tomorrowEvents} title='Demain' />
        <EventList events={thisWeekEvents} title='Cette semaine' />
        <EventList events={nextWeekEvents} title='La semaine prochaine' />
        <EventList events={laterEvents} title="Dans plus d'une semaine" />
        <div className='flex flex-col lg:flex-row gap-4 text-greenDark font-thin text-xs dark:text-green lg:fixed lg:bottom-2 lg:left-2'>
          <Link to='/docs/legal'>Mentions légales</Link>
          <Link to='/docs/privacy'>Politique de confidentialité</Link>
        </div>
      </div>
    </main>
  );
};

type EventListProps = { events: BridgeEvent[]; title: string };
const EventList = ({ events, title }: EventListProps) => {
  return events.length ? (
    <div className='flex flex-col space-y-2 z-20'>
      <h2 className='text-2xl font-bold pl-4 text-white'>{title}</h2>
      {events.map((data) => (
        <BridgeEventItem key={data.closeAt.getTime()} {...data} />
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
