import dayjs from 'dayjs';
import * as Notifications from 'expo-notifications';
import { BridgeEvent } from '../../App';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const schedulePushNotification = async (start: Date, end: Date) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Fermeture du pont Chaban Delmas',
      body: `Le pont sera fermé de ${dayjs(start).hour()}h${dayjs(start).format('mm')} à ${dayjs(end).hour()}h${dayjs(
        end
      ).format('mm')}`,
    },
    trigger: { date: dayjs(start).subtract(1, 'h').toDate() },
  });
};

export const scheduleNewEventNotification = async (events?: BridgeEvent[]) => {
  const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
  if (events && events.length) {
    if (scheduledNotifications.length) {
      events.forEach(({ closeAt, openAt }, i) => {
        const scheduledNotification = scheduledNotifications.find(
          //@ts-ignore
          (notification) => notification.trigger?.value === dayjs(closeAt).subtract(1, 'h').toDate().getTime()
        );
        if (!scheduledNotification) {
          schedulePushNotification(closeAt, openAt);
        }
      });
    } else {
      events.forEach(({ closeAt, openAt }) => {
        schedulePushNotification(closeAt, openAt);
      });
    }
  }
};
