import { prisma } from '@chaban/db';
import { z } from 'zod';
import { createProcedure } from '../../config/api';
import { isRegistered } from '../context';

export const deleteNotificationRuleSchema = z.object({
  id: z.string(),
});

export const deleteNotificationRule = createProcedure
  .use(isRegistered)
  .input(deleteNotificationRuleSchema)
  .mutation(async ({ ctx: { deviceId }, input: { id } }) => {
    const deleted = await prisma.notificationRule.delete({ where: { id, deviceId } });
    return deleted;
  });
