import { prisma } from '@chaban/db';
import { z } from 'zod';
import { createProcedure } from '../../config/api';
import { isAuth } from '../context';

export const getDevicesSchema = z.object({});

export const getDevices = createProcedure
  .use(isAuth)
  .input(getDevicesSchema)
  .query(async ({ ctx: { userId } }) => {
    const devices = await prisma.device.findMany({ where: { userId } });
    return devices;
  });
