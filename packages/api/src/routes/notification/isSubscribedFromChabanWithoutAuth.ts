import { prisma } from '@chaban/db';
import { z } from 'zod';
import { createProcedure } from '../../config/api';
import { pushTokenSchema } from './pushToken';

const isSubscribedFromChabanWithoutAuthSchema = z.object({
  token: pushTokenSchema.optional(),
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

    return true;
  });
