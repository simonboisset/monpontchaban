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
  const now = new Date();
  const todayAlerts = alerts.filter(({ startAt }) => isToday(startAt, now));
  const tomorrowAlerts = alerts.filter(({ startAt }) => isTomorrow(startAt, now));
  const thisWeekAlerts = alerts.filter(({ startAt }) => isThisWeek(startAt, now));
  const nextWeekAlerts = alerts.filter(({ startAt }) => isNextWeek(startAt, now));
  const laterAlerts = alerts.filter(
    ({ startAt }) =>
      !isToday(startAt, now) && !isTomorrow(startAt, now) && !isThisWeek(startAt, now) && !isNextWeek(startAt, now),
  );
  return { todayAlerts, tomorrowAlerts, thisWeekAlerts, nextWeekAlerts, laterAlerts };
};
