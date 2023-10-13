import { prisma } from '@chaban/db';
import { z } from 'zod';
import { createProcedure } from '../../config/api';
import { isRegistered } from '../context';

export const createNotificationRuleSchema = z.object({
  title: z.string(),
  scheduleIds: z.array(z.number()),
  delayMinBefore: z.number().int(),
});

export const createNotificationRule = createProcedure
  .use(isRegistered)
  .input(createNotificationRuleSchema)
  .mutation(async ({ ctx: { deviceId }, input: { scheduleIds, delayMinBefore, title } }) => {
    const { schedules, ...notificationRule } = await prisma.notificationRule.create({
      data: {
        delayMinBefore,
        deviceId,
        title,
        active: true,
        schedules: { connect: scheduleIds.map((id) => ({ id })) },
      },
      include: { schedules: true },
    });

    return { ...notificationRule, scheduleIds: schedules.map(({ id }) => id) };
  });
