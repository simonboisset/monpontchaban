import { schedules } from '@chaban/core';
import { prisma } from '@chaban/db';
import { TRPCError } from '@trpc/server';
import dayjs from 'dayjs';
import { z } from 'zod';
import { createProcedure } from '../../config/api';
import { services } from '../../services';
import { logger } from '../context';
import { pushTokenSchema } from '../notification/pushToken';

export const confirmLoginSchema = z.object({
  pushToken: pushTokenSchema,
  confirmToken: z.string(),
});

export const confirmLogin = createProcedure
  .use(logger)
  .input(confirmLoginSchema)
  .mutation(async ({ input: { pushToken, confirmToken } }) => {
    const { deviceId, expiresAt } = services.token.confirmLogin.verify(confirmToken);
    if (dayjs(expiresAt).isBefore(dayjs())) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Token expired' });
    }
    const session = await prisma.session.create({
      data: { device: { connect: { id: deviceId, token: pushToken } } },
      include: { device: true },
    });

    const existingRules = await prisma.notificationRule.findMany({ where: { deviceId } });

    if (existingRules.length === 0) {
      await prisma.notificationRule.create({
        data: {
          title: `⏰ Alerte Fermeture du pont chaban`,
          delayMinBefore: 60,
          schedules: { connect: schedules.map((s) => ({ id: s.id })) },
          deviceId,
        },
      });
      await prisma.notificationRule.create({
        data: {
          title: `🌉 Demain Fermeture du pont chaban`,
          delayMinBefore: 300,
          schedules: { connect: schedules.filter((s) => s.hour === 20).map((s) => ({ id: s.id })) },
          deviceId,
        },
      });
      await prisma.notificationRule.create({
        data: {
          title: `📅 Récap Hebdos du pont chaban`,
          delayMinBefore: 300,
          schedules: { connect: schedules.filter((s) => s.day === 0 && s.hour === 19).map((s) => ({ id: s.id })) },
          deviceId,
        },
      });
    }

    const authToken = services.token.auth.create({ deviceId: session.deviceId, sessionId: session.id });
    return { authToken, deviceId, pushToken };
  });
