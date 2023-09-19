import { Link } from '@remix-run/react';
import { Android } from '~/components/Android';
import { Apple } from '~/components/Apple';
import { BridgeStatus } from '~/components/BridgeStatus';
import { EventList, groupAlertsByDate } from '~/components/EventList';
import { useRoot } from '~/domain/theme';
import { Button } from '~/ui/button';

export default function Index() {
  const { alerts } = useRoot();
  const { laterAlerts, nextWeekAlerts, thisWeekAlerts, todayAlerts, tomorrowAlerts } = groupAlertsByDate(alerts);
  return (
    <div>
      <h1 className='text-center font-black text-6xl mb-8'>Mon Pont Chaban</h1>
      <h2 className='text-center font-bold text-xl mb-24'>
        Les horaires du pont Chaban-Delmas de Bordeaux en temps réel. Tenez vous informé des prochaines fermetures en un
        coup d'oeil. Pour plus de simplicité, téléchargez l'application et activez les notifications.
      </h2>

      <BridgeStatus />
      <h2 className='text-center font-bold text-4xl mt-24 mb-12'>L'application mobile</h2>
      <h3 className='text-center font-bold text-xl mb-12'>
        Téléchargez l'application mobile pour être notifié des prochaines fermetures du pont Chaban-Delmas.
      </h3>
      <div className='flex flex-row gap-4 mt-2 justify-center max-w-lg mx-auto'>
        <Button asChild>
          <Link to='https://apps.apple.com/app/mon-pont-chaban/id6448217836' className='flex-1'>
            <span>iOS</span>
            <Apple className='h-4 w-4 mb-1 ml-2' />
          </Link>
        </Button>
        <Button asChild>
          <Link to='https://play.google.com/store/apps/details?id=com.simonboisset.monpontchaban' className='flex-1'>
            <span>Android</span>
            <Android className='h-4 w-4 ml-2' />
          </Link>
        </Button>
      </div>
      <EventList events={todayAlerts} title='Aujourd’hui' />
      <EventList events={tomorrowAlerts} title='Demain' />
      <EventList events={thisWeekAlerts} title='Cette semaine' />
      <EventList events={nextWeekAlerts} title='La semaine prochaine' />
      <EventList events={laterAlerts} title="Dans plus d'une semaine" />
    </div>
  );
}
