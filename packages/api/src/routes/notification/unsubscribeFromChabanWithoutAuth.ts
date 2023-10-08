import { prisma } from '@chaban/db';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createProcedure } from '../../config/api';
import { pushTokenSchema } from './pushToken';

const unsubscribeFromChabanWithoutAuthSchema = z.object({
  token: pushTokenSchema,
});

export const unsubscribeFromChabanWithoutAuth = createProcedure
  .input(unsubscribeFromChabanWithoutAuthSchema)
  .mutation(async ({ input: { token } }) => {
    const existingDevice = await prisma.device.findFirst({ where: { token } });
    if (!existingDevice) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Device not found' });
    }

    const device = await prisma.device.delete({ where: { id: existingDevice.id } });
    return device;
  });
