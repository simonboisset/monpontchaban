import { SupportIssueCategory, SupportIssueStatus, prisma } from '@lezo-alert/db';
import { z } from 'zod';
import { createProcedure } from '../../config/api';
import { isAdmin } from '../context';

export const updateSupportIssueSchema = z.object({
  id: z.string(),
  status: z.nativeEnum(SupportIssueStatus).optional(),
  category: z.nativeEnum(SupportIssueCategory).optional(),
  title: z.string().optional(),
});

export const updateSupportIssue = createProcedure
  .use(isAdmin)
  .input(updateSupportIssueSchema)
  .mutation(async ({ input: { id, status, category, title } }) => {
    return prisma.supportIssue.update({
      where: { id },
      data: { status, category, title },
    });
  });
