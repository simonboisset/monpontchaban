import { prisma } from '@chaban/db';
import { z } from 'zod';
import { createProcedure } from '../../config/api';
import { isRegistered } from '../context';

export const deleteAccountSchema = z.object({});

export const deleteAccount = createProcedure
  .use(isRegistered)
  .input(deleteAccountSchema)
  .mutation(async ({ ctx: { deviceId } }) => {
    await prisma.$transaction([
      prisma.session.deleteMany({ where: { deviceId } }),
      prisma.report.deleteMany({ where: { deviceId } }),
      prisma.notificationRule.deleteMany({ where: { deviceId } }),
      prisma.device.delete({ where: { id: deviceId } }),
    ]);

    return true;
  });
