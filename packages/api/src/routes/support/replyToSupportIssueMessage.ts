import { prisma } from '@lezo-alert/db';
import { z } from 'zod';
import { createProcedure } from '../../config/api';
import { isAdmin } from '../context';

export const replyToSupportIssueMessageSchema = z.object({
  text: z.string(),
  issueId: z.string(),
});

export const replyToSupportIssueMessage = createProcedure
  .use(isAdmin)
  .input(replyToSupportIssueMessageSchema)
  .mutation(async ({ input: { text, issueId } }) => {
    const issue = await prisma.supportIssue.update({
      where: { id: issueId },
      data: { messages: { create: { text, isFromAdmin: true } } },
    });
    return issue;
  });
