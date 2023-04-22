import { prisma } from '@lezo-alert/db';
import { z } from 'zod';
import { createProcedure } from '../../config/api';
import { isAuth } from '../context';

export const sendSupportIssueMessageSchema = z.object({
  text: z.string(),
  issueId: z.string(),
});

export const sendSupportIssueMessage = createProcedure
  .use(isAuth)
  .input(sendSupportIssueMessageSchema)
  .mutation(async ({ input: { text, issueId }, ctx: { userId } }) => {
    const issue = await prisma.supportIssue.update({
      where: { id: issueId, userId },
      data: { messages: { create: { text } } },
    });
    return issue;
  });
