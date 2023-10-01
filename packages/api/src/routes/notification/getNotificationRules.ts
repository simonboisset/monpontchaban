import { prisma } from '@chaban/db';
import { z } from 'zod';
import { createProcedure } from '../../config/api';
import { isRegistered } from '../context';

export const getNotificationRulesSchema = z.object({});

export const getNotificationRules = createProcedure
  .use(isRegistered)
  .input(getNotificationRulesSchema)
  .query(async ({ ctx: { deviceId } }) => {
    const notificationRule = await prisma.notificationRule.findMany({
      where: { deviceId },
    });

    return notificationRule;
  });
