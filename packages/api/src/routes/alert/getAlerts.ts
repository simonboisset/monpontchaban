import { prisma } from '@lezo-alert/db';
import { z } from 'zod';
import { createProcedure } from '../../config/api';

export const getAlertsSchema = z.object({
  channelIds: z.array(z.string()),
  minDate: z.date().optional(),
  maxDate: z.date().optional(),
});

export const getAlerts = createProcedure
  .input(getAlertsSchema)
  .query(async ({ input: { minDate, maxDate, channelIds } }) => {
    if (!minDate && !maxDate) {
      return await prisma.alert.findMany();
    }
    const alerts = await prisma.alert.findMany({
      where: { channelId: { in: channelIds }, OR: [{ endAt: { gte: minDate } }, { startAt: { lte: maxDate } }] },
      orderBy: { startAt: 'asc' },
    });

    return alerts;
  });
