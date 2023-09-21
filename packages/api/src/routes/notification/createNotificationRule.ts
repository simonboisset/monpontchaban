import { prisma } from '@chaban/db';
import { z } from 'zod';
import { createProcedure } from '../../config/api';
import { isFeature } from '../context';

export const createNotificationRuleSchema = z.object({
  scheduleIds: z.array(z.number()),
  delayMinBefore: z.number().int(),
});

export const createNotificationRule = createProcedure
  .use(isFeature('NOTIFICATION_CUSTOM'))
  .input(createNotificationRuleSchema)
  .mutation(async ({ ctx: { userId }, input: { scheduleIds, delayMinBefore } }) => {
    const notificationRule = await prisma.notificationRule.create({
      data: { delayMinBefore, scheduleIds, userId },
    });

    return notificationRule;
  });
