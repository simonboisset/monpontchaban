import { prisma } from '@chaban/db';
import { z } from 'zod';
import { createProcedure } from '../../config/api';
import { isRegistered } from '../context';
import { pushTokenSchema } from './pushToken';

export const updatePushTokenSchema = z.object({
  pushToken: pushTokenSchema,
});

export const updatePushToken = createProcedure
  .use(isRegistered)
  .input(updatePushTokenSchema)
  .mutation(async ({ ctx: { deviceId }, input: { pushToken } }) => {
    const device = await prisma.device.update({
      where: { id: deviceId },
      data: { token: pushToken },
    });

    return device;
  });
