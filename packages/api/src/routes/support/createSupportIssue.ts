import { SupportIssueCategory, prisma } from '@lezo-alert/db';
import { z } from 'zod';
import { createProcedure } from '../../config/api';
import { isAuth } from '../context';

export const createSupportIssueSchema = z.object({
  category: z.nativeEnum(SupportIssueCategory),
  text: z.string(),
});

export const createSupportIssue = createProcedure
  .use(isAuth)
  .input(createSupportIssueSchema)
  .mutation(async ({ input: { category, text }, ctx: { userId } }) => {
    const issue = await prisma.supportIssue.create({ data: { userId, category, messages: { create: { text } } } });
    return { issueId: issue.id };
  });
