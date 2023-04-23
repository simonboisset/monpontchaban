import { prisma } from '@lezo-alert/db';
import { TRPCError } from '@trpc/server';
import React from 'react';
import { z } from 'zod';
import { createProcedure } from '../../config/api';
import { services } from '../../services';
import { ValidationCode } from '../../services/email';

export const requestAuthenticationCodeSchema = z.object({
  email: z.string().email(),
});

export const requestAuthenticationCode = createProcedure
  .input(requestAuthenticationCodeSchema)
  .mutation(async ({ input: { email } }) => {
    const { hash, code } = services.hash.generatePinCode();
    const emailHash = services.hash.encrypt(email);
    const user = await prisma.user.findUnique({ where: { emailHash }, include: { code: true } });
    if (user) {
      if (user.code) {
        if (isCodeExpired(user.code.createdAt)) {
          await prisma.userCode.delete({ where: { id: user.code.id } });
        } else {
          throw new TRPCError({ code: 'TOO_MANY_REQUESTS', message: 'Too many requests' });
        }
      }

      await prisma.user.update({ where: { id: user.id }, data: { code: { create: { type: 'LOGIN', hash } } } });
    } else {
      await prisma.user.create({ data: { emailHash, code: { create: { type: 'REGISTER', hash } } } });
    }

    await services.email.send({
      from: 'noreply@lezo.dev',
      to: email,
      subject: 'Pont Chaban: Code de vérification',
      react: <ValidationCode code={code} email={email} />,
    });
    return { email };
  });

export const CODE_EXPIRATION_TIME = 5 * 60 * 1000;

export const isCodeExpired = (createdAt: Date) => {
  const now = new Date();
  return now.getTime() - createdAt.getTime() > CODE_EXPIRATION_TIME;
};
