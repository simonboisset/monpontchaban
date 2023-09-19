import { prisma } from '@chaban/db';
import { z } from 'zod';
import { createProcedure } from '../../config/api';
import { isAuth } from '../context';

export const deleteNotificationRuleSchema = z.object({
  id: z.string(),
});

export const deleteNotificationRule = createProcedure
  .use(isAuth)
  .input(deleteNotificationRuleSchema)
  .mutation(async ({ input: { id }, ctx: { userId } }) => {
    await prisma.notificationRule.delete({ where: { id, userId } });
    return true;
  });
