import { prisma } from '@lezo-alert/db';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createProcedure } from '../../config/api';
import { isAuth } from '../context';

export const deleteDeviceSchema = z.object({
  deviceId: z.string(),
});

export const deleteDevice = createProcedure
  .use(isAuth)
  .input(deleteDeviceSchema)
  .mutation(async ({ input: { deviceId }, ctx: { userId } }) => {
    const device = await prisma.device.findUnique({ where: { id: deviceId, userId } });
    if (!device) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Device not found' });
    }

    await prisma.device.delete({ where: { id: deviceId } });
    return true;
  });
