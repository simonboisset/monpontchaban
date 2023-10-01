import { prisma } from '@chaban/db';
import { z } from 'zod';
import { createProcedure } from '../../config/api';
import { logger } from '../context';

export const getCurrentDeviceSchema = z.object({});

export const getCurrentDevice = createProcedure
  .use(logger)
  .input(getCurrentDeviceSchema)
  .query(async ({ ctx: { deviceId } }) => {
    if (!deviceId) {
      return null;
    }
    const device = await prisma.device.findFirst({ where: { id: deviceId } });
    if (!device) {
      return null;
    }
    return device;
  });
