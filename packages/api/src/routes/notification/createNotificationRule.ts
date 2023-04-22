import { prisma } from '@lezo-alert/db';
import { z } from 'zod';
import { createProcedure } from '../../config/api';
import { isAuth } from '../context';

export const createNotificationRuleSchema = z.object({
  schedules: z.array(z.object({ day: z.number().int(), hour: z.number().int() })),
  delayMinBefore: z.number().int(),
  channelId: z.string(),
});

export const createNotificationRule = createProcedure
  .use(isAuth)
  .input(createNotificationRuleSchema)
  .mutation(async ({ input: { schedules, channelId, delayMinBefore }, ctx: { userId } }) => {
    const schedulesFromDb = await prisma.$transaction(
      schedules.map(({ day, hour }) =>
        prisma.schedule.findUnique({ where: { day_hour: { day, hour } }, select: { id: true } }),
      ),
    );

    const filtredSchedules = getNonNullableArray(schedulesFromDb);
    const notificationRule = await prisma.notificationRule.create({
      data: {
        delayMinBefore,
        channelId,
        schedules: { connect: filtredSchedules },
        userId,
      },
    });

    return notificationRule;
  });
const getNonNullableArray = <T>(arr: (T | null | undefined)[]): T[] => {
  return arr.filter((item) => item !== null && item !== undefined) as T[];
};
