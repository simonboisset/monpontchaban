import { Plan } from '@chaban/db';
import { sign, verify } from 'jsonwebtoken';
import { ZodType, z } from 'zod';
import { env } from '../config/env';

const tokenFactory = <I extends Object, O extends Object>(schema: ZodType<O, any, I>) => ({
  create: (params: I) => {
    const paramsValidated = schema.parse(params);
    const token = sign(paramsValidated, env.JWT_SECRET);
    return token;
  },
  verify: (token: string) => {
    const decoded = verify(token, env.JWT_SECRET);
    const validated = schema.parse(decoded);
    return validated;
  },
  safeVerify: (token: string) => {
    try {
      const decoded = verify(token, env.JWT_SECRET);
      const validated = schema.parse(decoded);
      return validated;
    } catch (e) {
      return null;
    }
  },
});

export const AUTH_TOKEN_TIMEOUT = 3 * 30 * 24 * 60 * 60 * 1000;
export const AUTH_ATTEMPTS_LIMIT = 5;
export const token = {
  auth: tokenFactory(
    z.object({
      expiresAt: z.string().transform((d) => new Date(d)),
      userId: z.string(),
      plan: z.nativeEnum(Plan),
    }),
  ),
  confirmOtp: tokenFactory(z.object({ email: z.string(), code: z.string() })),
  isExpired: (expiresAt: Date) => expiresAt.getTime() < new Date().getTime(),
  shouldRefresh: (createdAt: Date, expiresAt: Date) =>
    (expiresAt.getTime() - createdAt.getTime()) / (new Date().getTime() - createdAt.getTime()) < 0.5,
};
