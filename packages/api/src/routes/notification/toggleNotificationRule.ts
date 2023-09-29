import { prisma } from '@chaban/db';
import { z } from 'zod';
import { createProcedure } from '../../config/api';
import { isRegistered } from '../context';

export const toggleNotificationRuleSchema = z.object({
  notificationRuleId: z.string(),
  active: z.boolean(),
});

export const toggleNotificationRule = createProcedure
  .use(isRegistered)
  .input(toggleNotificationRuleSchema)
  .mutation(async ({ ctx: { deviceId }, input: { notificationRuleId, active } }) => {
    const notificationRule = await prisma.notificationRule.update({
      where: { id: notificationRuleId, deviceId },
      data: { active },
    });

    return notificationRule;
  });
