import { prisma } from '@chaban/db';
import { z } from 'zod';
import { createProcedure } from '../../config/api';
import { isRegistered } from '../context';

export const updateNotificationRuleSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  scheduleIds: z.array(z.number()).optional(),
  delayMinBefore: z.number().int().optional(),
});

export const updateNotificationRule = createProcedure
  .use(isRegistered)
  .input(updateNotificationRuleSchema)
  .mutation(async ({ ctx: { deviceId }, input: { scheduleIds, id, delayMinBefore, title } }) => {
    const notificationRule = await prisma.notificationRule.update({
      where: { id, deviceId },
      data: {
        delayMinBefore,
        deviceId,
        title,
        schedules: scheduleIds ? { set: scheduleIds.map((id) => ({ id })) } : undefined,
      },
      include: { schedules: true },
    });

    return notificationRule;
  });
