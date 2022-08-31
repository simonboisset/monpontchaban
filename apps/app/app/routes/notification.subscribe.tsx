import { PrismaClient } from '@prisma/client';
import type { ActionFunction } from '@remix-run/node';
import { json } from '@remix-run/node';

export const action: ActionFunction = async ({ request }) => {
  const data = await request.json();

  const token = data.token.data;
  if (!token) {
    console.error('[Notification Subscribe] Token not found');
    return json({ error: '[Notification Subscribe] Token not found' }, { status: 400 });
  }

  try {
    const db = new PrismaClient();
    if (request.method === 'DELETE') {
      await db.device.delete({ where: { token } });
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
