import { prisma } from '@chaban/db';
import { z } from 'zod';
import { createProcedure } from '../../config/api';
import { isCron } from '../context';

export const deleteExpiredUserCodesSchema = z.object({});
const CODE_EXPIRATION_TIME = 1000 * 60 * 60 * 24; // 1 days
export const deleteExpiredUserCodes = createProcedure
  .use(isCron)
  .input(deleteExpiredUserCodesSchema)
  .mutation(async () => {
    const expirationTime = new Date(Date.now() - CODE_EXPIRATION_TIME);

    const otherDeleted = await prisma.verification.deleteMany({ where: { createdAt: { lt: expirationTime } } });
    return { count: otherDeleted.count };
  });
