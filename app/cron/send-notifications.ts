import { schedule } from '@netlify/functions';

export const handler = schedule('@hourly', async function (event) {
  console.log('Received event:', event);
  const SEND_NOTIFICATION_TOKEN = process.env.SEND_NOTIFICATION_TOKEN;
  console.log(SEND_NOTIFICATION_TOKEN);

  if (!SEND_NOTIFICATION_TOKEN) {
    console.error('[Send notification] Token is not defined');
    return {
      statusCode: 400,
    };
  }
  const req = await fetch('https://horaires-pont-chaban-delmas.simonboisset.com/notification/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token: SEND_NOTIFICATION_TOKEN }),
  });
  console.log(req.status);

  return {
    statusCode: req.status,
  };
});
