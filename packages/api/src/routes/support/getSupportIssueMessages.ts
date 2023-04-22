import { prisma } from '@lezo-alert/db';
import { z } from 'zod';
import { createProcedure } from '../../config/api';
import { isAuth } from '../context';

export const getSupportIssueMessagesSchema = z.object({
  issueId: z.string(),
  limit: z.number().int().optional(),
  offset: z.number().int().optional(),
});

export const getSupportIssueMessages = createProcedure
  .use(isAuth)
  .input(getSupportIssueMessagesSchema)
  .query(async ({ input: { issueId, limit, offset }, ctx: { userId, isAdmin } }) => {
    const messages = await prisma.supportMessage.findMany({
      where: { issue: { id: issueId, userId: isAdmin ? undefined : userId } },
      take: limit,
      skip: offset,
    });
    return messages;
  });
