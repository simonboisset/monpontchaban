import { prisma } from '@chaban/db';
import { TRPCError } from '@trpc/server';
import z from 'zod';
import { createProcedure } from '../../../config/api';
import { services } from '../../../services';
import { SignupEmail } from '../../../services/email/templates/Signup';
import { logger } from '../../context';

const sendOtpSchema = z.object({
  email: z.string().email(),
});

export const sendOtp = createProcedure
  .use(logger)
  .input(sendOtpSchema)
  .mutation(async ({ input: { email }, ctx: { domain } }) => {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    if (user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User already exists',
        cause: { email: 'User already exists' },
      });
    }
    const { otp, secret, algorithm, period, digits } = services.totp.generate({
      algorithm: 'SHA256',
      period: 60 * 60 * 1000,
    });

    await prisma.verification.deleteMany({
      where: { type: 'ONBOARDING', target: email },
    });
    await prisma.verification.create({
      data: {
        type: 'ONBOARDING',
        target: email,
        algorithm,
        secret,
        period,
        digits,
        expiresAt: new Date(Date.now() + period * 10000),
      },
    });

    const resetPasswordUrl = new URL(`${domain}/auth/signup/verify`);
    resetPasswordUrl.searchParams.set('email', email);
    resetPasswordUrl.searchParams.set('code', otp);
    await services.email.send({
      to: email,
      from: { address: 'notifications@pont-chaban-delmas.com', name: 'Mon Pont Chaban' },
      subject: `Inscription à Mon Pont Chaban`,
      react: <SignupEmail onboardingUrl={resetPasswordUrl.toString()} otp={otp} />,
    });

    return { send: true, email };
  });
