import { prisma } from '@chaban/db';
import { TRPCError } from '@trpc/server';
import z from 'zod';
import { createProcedure } from '../../../config/api';
import { services } from '../../../services';
import { AUTH_ATTEMPTS_LIMIT, AUTH_TOKEN_TIMEOUT } from '../../../services/token';
import { logger } from '../../context';

const confirmOtpSchema = z.object({
  email: z.string().email(),
  code: z.string().max(6).min(6),
});

export const confirmOtp = createProcedure
  .use(logger)
  .input(confirmOtpSchema)
  .mutation(async ({ input: { email, code } }) => {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, plan: true, name: true },
    });
    if (!user) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found', cause: { email: 'User not found' } });
    }
    const verification = await prisma.verification.findFirst({
      where: { type: 'FORGOT_PASSWORD', target: user.id },
      orderBy: { createdAt: 'desc' },
    });
    if (!verification) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Verification not found' });
    }
    const updatedVerification = await prisma.verification.update({
      where: { id: verification.id },
      data: { attemptsCount: { increment: 1 } },
    });

    if (!updatedVerification) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Verification not found' });
    }

    if (updatedVerification.attemptsCount > AUTH_ATTEMPTS_LIMIT) {
      await prisma.verification.delete({ where: { id: updatedVerification.id } });
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Attempts limit' });
    }

    const otpVerification = services.totp.verify({
      otp: code,
      ...updatedVerification,
    });
    if (!otpVerification) {
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid OTP' });
    }
    await prisma.verification.delete({ where: { id: updatedVerification.id } });
    const token = services.token.auth.create({
      expiresAt: new Date(Date.now() + AUTH_TOKEN_TIMEOUT).toISOString(),
      userId: user.id,
      plan: user.plan,
    });

    return { token, user };
  });
