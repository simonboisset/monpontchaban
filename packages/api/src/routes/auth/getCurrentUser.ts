import { prisma } from '@chaban/db';
import { TRPCError } from '@trpc/server';
import { createProcedure } from '../../config/api';

export const getCurrentUser = createProcedure.query(async ({ ctx: { userId } }) => {
  if (!userId) {
    return null;
  }
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, plan: true, name: true },
  });

  if (!user) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
  }

  return user;
});
