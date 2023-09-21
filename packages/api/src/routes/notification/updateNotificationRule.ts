import { prisma } from '@chaban/db';
import { z } from 'zod';
import { createProcedure } from '../../config/api';
import { isFeature } from '../context';

export const updateNotificationRuleSchema = z.object({
  id: z.string(),
  schedules: z.array(z.object({ day: z.number().int(), hour: z.number().int() })),
});

export const updateNotificationRule = createProcedure
  .use(isFeature('NOTIFICATION_CUSTOM'))
  .input(updateNotificationRuleSchema)
  .mutation(async ({ input: { schedules, id } }) => {
    const schedulesFromDb = await prisma.$transaction(
      schedules.map(({ day, hour }) =>
        prisma.schedule.findUnique({ where: { day_hour: { day, hour } }, select: { id: true } }),
      ),
    );

    const filtredSchedules = getNonNullableArray(schedulesFromDb);
    const notificationRule = await prisma.notificationRule.update({
      where: { id },
      data: {
        schedules: { set: filtredSchedules },
      },
    });

    return notificationRule;
  });

const getNonNullableArray = <T>(arr: (T | null | undefined)[]): T[] => {
  return arr.filter((item) => item !== null && item !== undefined) as T[];
};
