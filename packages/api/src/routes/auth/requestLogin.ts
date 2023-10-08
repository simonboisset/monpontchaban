import { prisma } from '@chaban/db';
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
    const device = await prisma.device.upsert({
      create: { token },
      update: { token },
      where: { token },
    });
    const expiresAt = dayjs().add(15, 'm').toISOString();
    const confirmToken = services.token.confirmLogin.create({ deviceId: device.id, expiresAt: expiresAt });

    await services.notification.send({
      title: 'Connexion au notifications',
      message: 'Vous recevez ce message pour confirmer votre connexion aux notifications',
      tokens: [token],
      data: { confirmToken },
    });
    return true;
  });
