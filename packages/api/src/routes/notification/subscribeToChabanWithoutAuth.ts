import { DeviceOs, prisma } from '@lezo-alert/db';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createProcedure } from '../../config/api';

const subscribeToChabanWithoutAuthSchema = z.object({
  token: z.string(),
  os: z.nativeEnum(DeviceOs),
});

export const subscribeToChabanWithoutAuth = createProcedure
  .input(subscribeToChabanWithoutAuthSchema)
  .mutation(async ({ input: { token, os } }) => {
    const existingDevice = await prisma.device.findFirst({ where: { token } });
    if (existingDevice) {
      if (existingDevice.userId) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Device already subscribed with user' });
      }
      const device = await prisma.device.update({ where: { id: existingDevice.id }, data: { os, active: true } });
      return device;
    }

    const device = await prisma.device.create({
      data: { token, os, active: true },
    });
    return device;
  });
