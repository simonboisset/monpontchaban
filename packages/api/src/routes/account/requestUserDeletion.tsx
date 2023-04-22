import { prisma } from '@lezo-alert/db';
import { TRPCError } from '@trpc/server';
import React from 'react';
import { z } from 'zod';
import { createProcedure } from '../../config/api';
import { services } from '../../services';
import { DeletionCode } from '../../services/email';
import { isAuth } from '../context';

export const requestUserDeletionSchema = z.object({
  email: z.string().email(),
});

export const requestUserDeletion = createProcedure
  .use(isAuth)
  .input(requestUserDeletionSchema)
  .mutation(async ({ ctx: { userId }, input: { email } }) => {
    const emailHash = services.hash.encrypt(email);
    const user = await prisma.user.findUnique({ where: { id: userId, emailHash }, include: { code: true } });
    if (!user) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
    }

    const { hash, code } = services.hash.generatePinCode();
    await prisma.userCode.create({ data: { type: 'DELETE', userId: user.id, hash } });

    await services.email.send({
      from: 'noreply@lezo.dev',
      to: email,
      subject: 'Confirmation de suppression de compte',
      react: <DeletionCode code={code} />,
    });

    return {
      token: services.token.auth.create({
        createdAt: new Date().toISOString(),
        userId: user.id,
        isAdmin: user.isAdmin,
      }),
    };
  });
