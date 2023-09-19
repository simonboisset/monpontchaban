// import { api, filterNextBridgeEvents } from '@chaban/chaban-core';
// import { PrismaClient } from '@chaban/db';
// import dayjs from 'dayjs';
// import { getPrNumberFromUrl } from '~/dev/getPrNumberFromUrl';
// import { getConfig } from '../config/getConfig';

// import { sendNotification } from './utils/send';

// export const sendBridgeAlert = createHandler('Send Notification Bridge Alert', async ({ request }) => {
//   const data = await request.json();
//   const token = data.token;
//   const { SEND_NOTIFICATION_TOKEN } = getConfig();

//   if (token !== SEND_NOTIFICATION_TOKEN) {
//     return { data: '[Send Notification] Invalid token', status: 403 };
//   }
//   const now = new Date();
//   const nextEvent = ((await api.get())?.filter(filterNextBridgeEvents(new Date())) || [])[0];
//   if (nextEvent && dayjs(nextEvent.closeAt).isAfter(now) && dayjs(nextEvent.closeAt).diff(now, 'hour') === 1) {
//     const DATABASE_URL = process.env.DATABASE_URL;
//     if (!DATABASE_URL) {
//       throw new Error('[Notification Subscribe] DATABASE_URL is not defined');
//     }
//     const prNumber = getPrNumberFromUrl(request.url);
//     const url = prNumber ? DATABASE_URL.replace('preview', `pr${prNumber}`) : DATABASE_URL;
//     const db = new PrismaClient({ datasources: { db: { url } } });
//     const devices = await db.device.findMany({ where: { active: true }, select: { token: true } });
//     await db.$disconnect();
//     try {
//       await sendNotification(
//         devices.map((d) => d.token),
//         'Fermeture du pont Chaban-Delmas',
//         `Le pont sera fermé de ${dayjs(nextEvent.closeAt).hour()}h${dayjs(nextEvent.closeAt).format('mm')} à ${dayjs(
//           nextEvent.openAt,
//         ).hour()}h${dayjs(nextEvent.openAt).format('mm')}`,
//       );
//     } catch (error) {
//       return { data: '[Send Notification] Error', status: 400 };
//     }
//     return { data: '[Send Notification] Success', status: 200 };
//   }
//   return { data: '[Send Notification] No notification to send', status: 200 };
// });
