import { Alert } from '@chaban/api';
import { isNextWeek, isThisWeek, isToday, isTomorrow } from '@chaban/core';
import { BridgeEventItem } from './BridgeEventItem';

type EventListProps = { events: Alert[]; title: string };
export const EventList = ({ events, title }: EventListProps) => {
  return events.length ? (
    <div className='flex flex-col gap-2 z-20 mt-16'>
      <h2 className='text-2xl font-bold text-center mb-8'>{title}</h2>
      <div className='flex flex-row flex-wrap gap-2'>
        {events.map((data) => (
          <BridgeEventItem key={data.id} {...data} />
        ))}
      </div>
    </div>
  ) : null;
};

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
