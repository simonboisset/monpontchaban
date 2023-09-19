import { DeviceOs, prisma } from '@chaban/db';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createProcedure } from '../../config/api';
import { services } from '../../services';

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
    await services.notification.send({
      title: 'Inscription à la notification du pont Chaban-Delmas',
      message:
        'Vous venez de vous inscrire à la notification du pont Chaban-Delmas. Vous recevrez une notification lorsque le pont sera fermé.',
      tokens: [token],
    });
    return device;
  });
