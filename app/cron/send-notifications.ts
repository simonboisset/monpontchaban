import { schedule } from '@netlify/functions';

export const handler = schedule('@hourly', async function (event) {
  console.log('Received event:', event);
  const { SEND_NOTIFICATION_TOKEN } = process.env;
  if (!SEND_NOTIFICATION_TOKEN) {
    console.error('[Send notification] Token is not defined');
    return {
      statusCode: 400,
    };
  }
  const req = await fetch('https://horaires-pont-chaban-delmas.simonboisset.com/notification/sent', {
    method: 'POST',
    headers: {
      token: SEND_NOTIFICATION_TOKEN,
    },
  });
  return {
    statusCode: req.status,
  };
});
