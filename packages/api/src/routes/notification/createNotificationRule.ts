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
    const notificationRule = await prisma.notificationRule.create({
      data: { delayMinBefore, deviceId, title },
    });
    await prisma.$transaction([
      ...scheduleIds.map((id) =>
        prisma.schedule.update({ where: { id }, data: { notifications: { connect: { id: notificationRule.id } } } }),
      ),
    ]);
    return notificationRule;
  });
