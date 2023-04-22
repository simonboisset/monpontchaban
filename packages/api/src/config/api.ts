import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import { ZodError } from 'zod';
import { ApiContext } from '../routes/context';

const api = initTRPC.context<ApiContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createProcedure = api.procedure;
export const createRouter = api.router;
export const createMiddleware = api.middleware;
