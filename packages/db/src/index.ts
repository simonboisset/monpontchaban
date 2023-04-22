import {PrismaClient} from '@prisma/client';

export * from '@prisma/client';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  errorFormat: process.env.NODE_ENV === 'development' ? 'pretty' : 'colorless',
});
