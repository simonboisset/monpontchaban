import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import { ApiContext } from '../routes/context';

const api = initTRPC.context<ApiContext>().create({
  transformer: superjson,
  errorFormatter: ({ shape }) => ({ ...shape }),
});

export const createProcedure = api.procedure;
export const createRouter = api.router;
export const createMiddleware = api.middleware;
