import type { ActionFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import Redis from 'ioredis';
import { api } from '~/const/api';
export const action: ActionFunction = async ({ request }) => {
  const data = await request.json();

  const token = data.token;
  const { SEND_NOTIFICATION_TOKEN, REDIS_URL } = process.env;
  if (!SEND_NOTIFICATION_TOKEN || !REDIS_URL) {
    return json({ error: '[Update cache] Token is not defined' }, { status: 400 });
  }

  if (token !== SEND_NOTIFICATION_TOKEN) {
    console.error('[Update cache] Invalid token');
    return json({ error: '[Update cache] Invalid token' }, { status: 400 });
  }

  try {
    const fetchedDatas = await api.get();
    const client = new Redis(REDIS_URL);
    await client.set('data', JSON.stringify(fetchedDatas));
  } catch (error) {
    return json({ error: '[Update cache] Redis fail' }, { status: 400 });
  }
  return json({ success: '[Update cache] Cache is updated' }, { status: 200 });
};
