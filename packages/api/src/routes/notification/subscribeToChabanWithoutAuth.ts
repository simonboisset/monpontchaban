import { prisma } from '@chaban/db';
import { z } from 'zod';
import { createProcedure } from '../../config/api';
import { services } from '../../services';

const subscribeToChabanWithoutAuthSchema = z.object({
  token: z.string(),
});

export const subscribeToChabanWithoutAuth = createProcedure
  .input(subscribeToChabanWithoutAuthSchema)
  .mutation(async ({ input: { token } }) => {
    const existingDevice = await prisma.device.findFirst({ where: { token } });
    if (existingDevice) {
      return existingDevice;
    }

    const device = await prisma.device.create({
      data: { token },
    });
    await services.notification.send({
      title: 'Inscription à la notification du pont Chaban-Delmas',
      message:
        'Vous venez de vous inscrire à la notification du pont Chaban-Delmas. Vous recevrez une notification lorsque le pont sera fermé.',
      tokens: [token],
    });
    return device;
  });
