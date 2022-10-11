import { api } from 'core';
import Redis from 'ioredis';
import { getConfig } from './config/getConfig';
import { createHandler } from './handler/handler';

export const cache = createHandler('cache', async ({ request }) => {
  const data = await request.json();

  const token = data.token;
  const { SEND_NOTIFICATION_TOKEN, REDIS_URL } = getConfig();

  if (token !== SEND_NOTIFICATION_TOKEN) {
    console.error('[Update cache] Invalid token');
    return { data: '[Update cache] Invalid token', status: 403 };
  }

  try {
    const fetchedDatas = await api.get();
    const client = new Redis(REDIS_URL);
    await client.set('data', JSON.stringify(fetchedDatas));
  } catch (error) {
    return { data: '[Update cache] Redis fail', status: 400 };
  }
  return { data: '[Update cache] Cache is updated', status: 200 };
});
