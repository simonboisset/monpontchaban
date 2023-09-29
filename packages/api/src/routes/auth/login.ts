import { prisma } from '@chaban/db';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createProcedure } from '../../config/api';
import { services } from '../../services';
import { logger } from '../context';

export const loginSchema = z.object({
  token: z.string(),
});

export const login = createProcedure
  .use(logger)
  .input(loginSchema)
  .mutation(async ({ input: { token } }) => {
    const existingDevice = await prisma.device.findFirst({ where: { token, sessions: { some: {} } } });
    if (existingDevice) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Device already registered' });
    }
    const session = await prisma.session.create({
      data: { device: { connectOrCreate: { create: { token }, where: { token } } } },
      include: { device: true },
    });

    const authToken = services.token.auth.create({ deviceId: session.deviceId, sessionId: session.id });
    return { authToken };
  });
