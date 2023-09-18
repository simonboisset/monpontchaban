import { prisma } from '@lezo-alert/db';
import { z } from 'zod';
import { createProcedure } from '../../config/api';

export const getStatisticsSchema = z.object({
  channelIds: z.array(z.string()),
  minDate: z.union([z.string().transform((d) => new Date(d)), z.date()]).optional(),
  maxDate: z.union([z.string().transform((d) => new Date(d)), z.date()]).optional(),
});

export const getStatistics = createProcedure
  .input(getStatisticsSchema)
  .query(async ({ input: { minDate, maxDate, channelIds } }) => {
    if (!minDate && !maxDate) {
      return await prisma.alert.findMany();
    }
    const alerts = await prisma.alert.findMany({
      where: { channelId: { in: channelIds }, OR: [{ endAt: { gte: minDate } }, { startAt: { lte: maxDate } }] },
      orderBy: { startAt: 'asc' },
    });

    let stats = {
      hours: {} as Record<number, number>,
      days: {} as Record<number, number>,
      months: {} as Record<number, number>,
    };

    for (const alert of alerts) {
      const startAt = new Date(alert.startAt);
      const hour = startAt.getHours();
      const day = startAt.getDay();
      const month = startAt.getMonth();
      stats.hours[hour] = stats.hours[hour] ? stats.hours[hour] + 1 : 1;
      stats.days[day] = stats.days[day] ? stats.days[day] + 1 : 1;
      stats.months[month] = stats.months[month] ? stats.months[month] + 1 : 1;
    }

    return stats;
  });
