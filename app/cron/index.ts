import { schedule } from '@netlify/functions';

export const handler = schedule('@hourly', async function (event, context) {
  console.log('Received event:', event);

  return {
    statusCode: 200,
  };
});
