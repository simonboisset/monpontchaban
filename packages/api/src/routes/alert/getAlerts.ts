import { prisma } from '@chaban/db';
import { z } from 'zod';
import { createProcedure } from '../../config/api';

export const getAlertsSchema = z.object({
  channelIds: z.array(z.string()).optional(),
  minDate: z.union([z.string().transform((d) => new Date(d)), z.date()]).optional(),
  maxDate: z.union([z.string().transform((d) => new Date(d)), z.date()]).optional(),
});

export const getAlerts = createProcedure.input(getAlertsSchema).query(async ({ input: { minDate, maxDate } }) => {
  if (!minDate && !maxDate) {
    return await prisma.alert.findMany();
  }
  const alerts = await prisma.alert.findMany({
    where: { OR: [{ endAt: { gte: minDate } }, { startAt: { lte: maxDate } }] },
    orderBy: { startAt: 'asc' },
  });

  return alerts;
});
