import { PrismaClient } from 'db';
import { getPrNumberFromUrl } from '~/dev/getPrNumberFromUrl';
import { getConfig } from '../config/getConfig';
import { chabanMonitor, createHandler } from '../handler/handler';

export const subscribe = createHandler('Subscribe to Notification', async ({ request }) => {
  const data = await request.json();

  const token = data.token.data;
  if (!token) {
    chabanMonitor().error('[Notification Subscribe] Token not found');
    return { data: '[Notification Subscribe] Token not found', status: 403 };
  }
  const { DATABASE_URL } = getConfig();

  try {
    const prNumber = getPrNumberFromUrl(request.url);
    const url = prNumber ? DATABASE_URL.replace('preview', `pr${prNumber}`) : DATABASE_URL;
    chabanMonitor().info('[Notification Subscribe] url', url);
    const db = new PrismaClient({ datasources: { db: { url } } });
    if (request.method === 'DELETE') {
      chabanMonitor().info('[Notification Subscribe] Delete');
      const existingToken = await db.device.findFirst({ where: { token } });
      chabanMonitor().info('[Notification Subscribe] First', existingToken);
      if (existingToken) {
        await db.device.delete({ where: { token } });
        chabanMonitor().info('[Notification Subscribe] delete', existingToken);
      }
    } else {
      chabanMonitor().info('[Notification Subscribe] upsert');
      await db.device.upsert({ where: { token }, create: { token, active: true }, update: { active: true } });
      chabanMonitor().info('[Notification Subscribe] saved');
    }
    await db.$disconnect();
    chabanMonitor().info('[Notification Subscribe] Success');
    return { data: '[Notification Subscribe] Success', status: 200 };
  } catch (error) {
    chabanMonitor().error('[Notification Subscribe] Save token failed', error);
    return { data: '[Notification Subscribe] Save token failed', status: 400 };
  }
});
