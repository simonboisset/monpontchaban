import { prisma } from '@chaban/db';
import { z } from 'zod';
import { createProcedure } from '../../config/api';
import { isRegistered } from '../context';

export const updateNotificationRuleSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  scheduleIds: z.array(z.number()).optional(),
  delayMinBefore: z.number().int().optional(),
  active: z.boolean().optional(),
});

export const updateNotificationRule = createProcedure
  .use(isRegistered)
  .input(updateNotificationRuleSchema)
  .mutation(async ({ ctx: { deviceId }, input: { scheduleIds, id, delayMinBefore, title, active } }) => {
    const { schedules, ...notificationRule } = await prisma.notificationRule.update({
      where: { id, deviceId },
      data: {
        delayMinBefore,
        deviceId,
        title,
        active,
        schedules: scheduleIds ? { set: scheduleIds.map((id) => ({ id })) } : undefined,
      },
      include: { schedules: true },
    });

    return { ...notificationRule, scheduleIds: schedules.map(({ id }) => id) };
  });
