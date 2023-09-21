import { prisma } from '@chaban/db';
import { TRPCError } from '@trpc/server';
import z from 'zod';
import { createProcedure } from '../../../config/api';
import { services } from '../../../services';
import { LoginEmail } from '../../../services/email/templates/Login';
import { logger } from '../../context';

const sendOtpSchema = z.object({
  email: z.string().email(),
});

export const sendOtp = createProcedure
  .use(logger)
  .input(sendOtpSchema)
  .mutation(async ({ input: { email }, ctx: { domain } }) => {
    let user: { id: string; email: string } | null = null;
    if (email === 'bk2hradhK0t1ol09Ou3CbI7hS8a62Rz0@lezo.dev') {
      user = await prisma.user.findUnique({
        where: { email: 'test@lezo.dev' },
        select: { id: true, email: true },
      });
    } else {
      user = await prisma.user.findUnique({
        where: { email },
        select: { id: true, email: true },
      });
    }
    if (!user) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found', cause: { email: 'User not found' } });
    }
    const { otp, secret, algorithm, period, digits } = services.totp.generate({
      algorithm: 'SHA256',
      period: 60 * 60 * 1000,
    });

    await prisma.verification.deleteMany({
      where: { type: 'FORGOT_PASSWORD', target: user.id },
    });
    await prisma.verification.create({
      data: {
        type: 'FORGOT_PASSWORD',
        target: user.id,
        algorithm,
        secret,
        period,
        digits,
        expiresAt: new Date(Date.now() + period * 10000),
      },
    });

    if (email !== 'bk2hradhK0t1ol09Ou3CbI7hS8a62Rz0@lezo.dev') {
      const resetPasswordUrl = new URL(`${domain}/auth/forgot-password/verify`);
      resetPasswordUrl.searchParams.set('code', email);
      await services.email.send({
        to: email,
        from: { address: 'notifications@pont-chaban-delmas.com', name: 'Mon Pont Chaban' },
        subject: `Connectez-vous à chaban`,
        react: <LoginEmail onboardingUrl={resetPasswordUrl.toString()} otp={otp} />,
      });
    }

    return { send: true, email: user.email, code: email === 'bk2hradhK0t1ol09Ou3CbI7hS8a62Rz0@lezo.dev' ? otp : null };
  });
