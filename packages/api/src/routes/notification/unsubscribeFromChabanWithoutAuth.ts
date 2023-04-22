import { prisma } from '@lezo-alert/db';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createProcedure } from '../../config/api';

const unsubscribeFromChabanWithoutAuthSchema = z.object({
  token: z.string(),
});

export const unsubscribeFromChabanWithoutAuth = createProcedure
  .input(unsubscribeFromChabanWithoutAuthSchema)
  .mutation(async ({ input: { token } }) => {
    const existingDevice = await prisma.device.findFirst({ where: { token } });
    if (!existingDevice) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Device not found' });
    }

    if (existingDevice.userId) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Device already subscribed with user' });
    }
    const device = await prisma.device.delete({ where: { id: existingDevice.id } });
    return device;
  });
