import { DeviceOs, prisma } from '@chaban/db';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createProcedure } from '../../config/api';
import { isAuth } from '../context';

export const addDeviceSchema = z.object({
  token: z.string(),
  os: z.nativeEnum(DeviceOs),
});

export const addDevice = createProcedure
  .use(isAuth)
  .input(addDeviceSchema)
  .mutation(async ({ input: { token, os }, ctx: { userId } }) => {
    const device = await prisma.device.findUnique({ where: { token } });
    if (device) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Device already exists' });
    }

    await prisma.device.create({ data: { token, userId, os } });

    return true;
  });
