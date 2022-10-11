import { api, filterNextBridgeEvents } from 'core';
import dayjs from 'dayjs';
import { getConfig } from '../config/getConfig';
import { createHandler } from '../handler/handler';
import { sendNotification } from './utils/send';

export const sendTest = createHandler('Send Notification Test', async () => {
  const { MY_PUSH_TOKEN } = getConfig();

  const nextEvent = ((await api.get())?.filter(filterNextBridgeEvents(new Date())) || [])[0];
  if (nextEvent) {
    try {
      await sendNotification(
        [MY_PUSH_TOKEN],
        'Fermeture du pont Chaban-Delmas',
        `Le pont sera fermé de ${dayjs(nextEvent.closeAt).hour()}h${dayjs(nextEvent.closeAt).format('mm')} à ${dayjs(
          nextEvent.openAt,
        ).hour()}h${dayjs(nextEvent.openAt).format('mm')}`,
      );
    } catch (error) {
      console.error('[Send Notification] Error', error);
      return { data: '[Send Notification] Error', status: 400 };
    }
    return { data: '[Send Notification] Success', status: 200 };
  }
  return { data: '[Send Notification] No notification to send', status: 200 };
});
