import type { ActionFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { PrismaClient } from 'db';
import { getPrNumberFromUrl } from '~/dev/getPrNumberFromUrl';

export const action: ActionFunction = async ({ request }) => {
  const data = await request.json();

  const token = data.token.data;
  if (!token) {
    console.error('[Notification Subscribe] Token not found');
    return json({ error: '[Notification Subscribe] Token not found' }, { status: 400 });
  }

  try {
    const DATABASE_URL = process.env.DATABASE_URL;
    if (!DATABASE_URL) {
      throw new Error('[Notification Subscribe] DATABASE_URL is not defined');
    }
    const prNumber = getPrNumberFromUrl(request.url);
    const url = prNumber ? DATABASE_URL.replace('preview', `pr-${prNumber}`) : DATABASE_URL;
    const db = new PrismaClient({ datasources: { db: { url } } });
    if (request.method === 'DELETE') {
      const existingToken = await db.device.findUnique({ where: { token } });
      if (existingToken) {
        await db.device.delete({ where: { token } });
      }
    } else {
      await db.device.upsert({ where: { token }, create: { token, active: true }, update: { active: true } });
    }
    await db.$disconnect();
    console.info('[Notification Subscribe] Success');
    return json({ success: '[Notification Subscribe] Success' }, { status: 200 });
  } catch (error) {
    console.error('[Notification Subscribe] Save token failed', error);
    return json({ error: '[Notification Subscribe] Save token failed' }, { status: 400 });
  }
};
