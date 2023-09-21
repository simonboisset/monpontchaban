import { prisma } from '@chaban/db';
import { z } from 'zod';
import { createProcedure } from '../../config/api';
import { isFeature } from '../context';

export const deleteNotificationRuleSchema = z.object({
  id: z.string(),
});

export const deleteNotificationRule = createProcedure
  .use(isFeature('NOTIFICATION_CUSTOM'))
  .input(deleteNotificationRuleSchema)
  .mutation(async ({ input: { id } }) => {
    await prisma.notificationRule.delete({ where: { id } });
    return true;
  });
