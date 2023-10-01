import { prisma } from '@chaban/db';
import { TRPCError } from '@trpc/server';
import dayjs from 'dayjs';
import { z } from 'zod';
import { createProcedure } from '../../config/api';
import { services } from '../../services';
import { logger } from '../context';

export const requestLoginSchema = z.object({
  token: z.string(),
});

export const requestLogin = createProcedure
  .use(logger)
  .input(requestLoginSchema)
  .mutation(async ({ input: { token } }) => {
    const existingDevice = await prisma.device.findFirst({ where: { token, sessions: { some: {} } } });
    if (existingDevice) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Device already registered' });
    }
    const device = await prisma.device.upsert({
      create: { token },
      update: { token },
      where: { token },
    });
    const expiresAt = dayjs().add(15, 'm').toISOString();
    const confirmToken = services.token.confirmLogin.create({ deviceId: device.id, expiresAt: expiresAt });
    await services.notification.send({ tokens: [token], data: { confirmToken } });
    return true;
  });
