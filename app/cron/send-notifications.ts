import { schedule } from '@netlify/functions';

export const handler = schedule('@hourly', async function (event) {
  const SEND_NOTIFICATION_TOKEN = process.env.SEND_NOTIFICATION_TOKEN;

  if (!SEND_NOTIFICATION_TOKEN) {
    console.error('[Send notification] Token is not defined');
    return {
      statusCode: 400,
    };
  }
  const req = await fetch('https://pont-chaban-delmas.com/notification/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token: SEND_NOTIFICATION_TOKEN }),
  });

  return {
    statusCode: req.status,
  };
});
