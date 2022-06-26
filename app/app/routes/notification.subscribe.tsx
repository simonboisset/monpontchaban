import type { ActionFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import db from '~/const/db.server';

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const entries = Object.fromEntries(formData) as Record<string, string | undefined>;
  const token = entries.token;
  if (!token) {
    return json({ error: '[Notification Subscribe] Token not found' }, { status: 400 });
  }

  try {
    if (request.method === 'DELETE') {
      await db.device.upsert({ where: { token }, create: { token, active: false }, update: { active: false } });
    } else {
      await db.device.upsert({ where: { token }, create: { token, active: true }, update: { active: true } });
    }
    return json({ success: '[Notification Subscribe] Success' }, { status: 200 });
  } catch (error) {
    return json({ error: '[Notification Subscribe] Save token failed' }, { status: 400 });
  }
};
