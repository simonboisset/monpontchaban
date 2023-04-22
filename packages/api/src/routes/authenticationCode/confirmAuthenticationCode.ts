import { prisma } from '@lezo-alert/db';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createProcedure } from '../../config/api';
import { services } from '../../services';
import { isCodeExpired } from './requestAuthenticationCode';

export const confirmAuthenticationCodeSchema = z.object({
  code: z.string(),
  email: z.string().email(),
});

export const confirmAuthenticationCode = createProcedure
  .input(confirmAuthenticationCodeSchema)
  .mutation(async ({ input: { code, email } }) => {
    const emailHash = services.hash.encrypt(email);
    const user = await prisma.user.findUnique({ where: { emailHash }, include: { code: true } });
    if (!user) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Invalid email' });
    }
    if (!user.code) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'No code requested' });
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
    await prisma.userCode.delete({ where: { id: user.code.id } });
    return {
      token: services.token.auth.create({
        createdAt: new Date().toISOString(),
        userId: user.id,
        isAdmin: user.isAdmin,
      }),
    };
  });
