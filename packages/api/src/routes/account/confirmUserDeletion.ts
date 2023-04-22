import { prisma } from '@lezo-alert/db';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createProcedure } from '../../config/api';
import { services } from '../../services';
import { isCodeExpired } from '../authenticationCode/requestAuthenticationCode';
import { isAuth } from '../context';

export const confirmUserDeletionSchema = z.object({
  code: z.string(),
});

export const confirmUserDeletion = createProcedure
  .use(isAuth)
  .input(confirmUserDeletionSchema)
  .mutation(async ({ input: { code }, ctx: { userId } }) => {
    const user = await prisma.user.findUnique({ where: { id: userId }, include: { code: true } });
    if (!user) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'User not found' });
    }
    if (!user.code || user.code.type !== 'DELETE') {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Invalid code' });
    }
    if (user.code.attempts >= 10) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Too many attempts' });
    }
    if (isCodeExpired(user.code.createdAt)) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Code expired' });
    }
    const isValid = services.hash.isValid(code, user.code.hash);
    if (!isValid) {
      await prisma.userCode.update({ where: { id: user.code.id }, data: { attempts: { increment: 1 } } });
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Invalid code' });
    }

    await prisma.$transaction([
      prisma.device.deleteMany({ where: { userId: user.id } }),
      prisma.userCode.deleteMany({ where: { userId: user.id } }),
      prisma.notificationRule.deleteMany({ where: { userId: user.id } }),
      prisma.supportMessage.deleteMany({ where: { issue: { userId: user.id } } }),
      prisma.supportIssue.deleteMany({ where: { userId: user.id } }),
      prisma.user.delete({ where: { id: user.id } }),
    ]);

    return true;
  });
