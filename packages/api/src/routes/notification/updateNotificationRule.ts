import { prisma } from '@lezo-alert/db';
import { z } from 'zod';
import { createProcedure } from '../../config/api';
import { isAuth } from '../context';

export const updateNotificationRuleSchema = z.object({
  id: z.string(),
  schedules: z.array(z.object({ day: z.number().int(), hour: z.number().int() })),
});

export const updateNotificationRule = createProcedure
  .use(isAuth)
  .input(updateNotificationRuleSchema)
  .mutation(async ({ input: { schedules, id }, ctx: { userId } }) => {
    const schedulesFromDb = await prisma.$transaction(
      schedules.map(({ day, hour }) =>
        prisma.schedule.findUnique({ where: { day_hour: { day, hour } }, select: { id: true } }),
      ),
    );

    const filtredSchedules = getNonNullableArray(schedulesFromDb);
    const notificationRule = await prisma.notificationRule.update({
      where: { id, userId },
      data: {
        schedules: { set: filtredSchedules },
      },
    });

    return notificationRule;
  });

const getNonNullableArray = <T>(arr: (T | null | undefined)[]): T[] => {
  return arr.filter((item) => item !== null && item !== undefined) as T[];
};
