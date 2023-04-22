import { SupportIssueCategory, SupportIssueStatus, prisma } from '@lezo-alert/db';
import { z } from 'zod';
import { createProcedure } from '../../config/api';
import { isAuth } from '../context';

export const getSupportIssuesSchema = z.object({
  category: z.nativeEnum(SupportIssueCategory).optional(),
  status: z.nativeEnum(SupportIssueStatus).optional(),
  limit: z.number().int().optional(),
  offset: z.number().int().optional(),
});

export const getSupportIssues = createProcedure
  .use(isAuth)
  .input(getSupportIssuesSchema)
  .query(async ({ input: { category, status, limit, offset } }) => {
    const issues = await prisma.supportIssue.findMany({
      where: { category, status },
      take: limit,
      skip: offset,
    });
    return issues;
  });
