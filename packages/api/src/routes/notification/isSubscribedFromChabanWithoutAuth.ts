import { prisma } from '@lezo-alert/db';
import { z } from 'zod';
import { createProcedure } from '../../config/api';

const isSubscribedFromChabanWithoutAuthSchema = z.object({
  token: z.string().optional(),
});

export const isSubscribedFromChabanWithoutAuth = createProcedure
  .input(isSubscribedFromChabanWithoutAuthSchema)
  .query(async ({ input: { token } }) => {
    if (!token) {
      return false;
    }
    const existingDevice = await prisma.device.findFirst({ where: { token } });
    if (!existingDevice) {
      return false;
    }

    if (existingDevice.userId || !existingDevice.active) {
      return false;
    }

    return true;
  });
