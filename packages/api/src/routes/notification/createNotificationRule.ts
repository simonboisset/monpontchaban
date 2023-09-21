import { prisma } from '@chaban/db';
import { z } from 'zod';
import { createProcedure } from '../../config/api';
import { isFeature } from '../context';

export const createNotificationRuleSchema = z.object({
  schedules: z.array(z.object({ day: z.number().int(), hour: z.number().int() })),
  delayMinBefore: z.number().int(),
  channelId: z.string().optional(),
});

export const createNotificationRule = createProcedure
  .use(isFeature('NOTIFICATION_CUSTOM'))
  .input(createNotificationRuleSchema)
  .mutation(async ({ input: { schedules, delayMinBefore } }) => {
    const schedulesFromDb = await prisma.$transaction(
      schedules.map(({ day, hour }) =>
        prisma.schedule.findUnique({ where: { day_hour: { day, hour } }, select: { id: true } }),
      ),
    );

    const filtredSchedules = getNonNullableArray(schedulesFromDb);
    const notificationRule = await prisma.notificationRule.create({
      data: {
        delayMinBefore,
        schedules: { connect: filtredSchedules },
      },
    });

    return notificationRule;
  });
const getNonNullableArray = <T>(arr: (T | null | undefined)[]): T[] => {
  return arr.filter((item) => item !== null && item !== undefined) as T[];
};
