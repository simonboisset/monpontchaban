import { prisma } from '@chaban/db';
import { z } from 'zod';
import { createProcedure } from '../../config/api';
import { isFeature } from '../context';

export const updateNotificationRuleSchema = z.object({
  id: z.string(),
  scheduleIds: z.array(z.number()).optional(),
});

export const updateNotificationRule = createProcedure
  .use(isFeature('NOTIFICATION_CUSTOM'))
  .input(updateNotificationRuleSchema)
  .mutation(async ({ input: { scheduleIds, id } }) => {
    const notificationRule = await prisma.notificationRule.update({ where: { id }, data: { scheduleIds } });

    return notificationRule;
  });
