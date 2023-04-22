import { sign, verify } from 'jsonwebtoken';
import { ZodType, z } from 'zod';
import { env } from '../config/env';

const tokenFactory = <I extends Object, O extends Object>(
  schema: ZodType<O, any, I>,
  secret: string,
  timeout: number,
) => ({
  create: (params: I) => {
    const paramsValidated = schema.parse(params);
    const token = sign(paramsValidated, secret);
    return token;
  },
  verify: (token: string) => {
    const decoded = verify(token, secret);
    const validated = schema.parse(decoded);
    return validated;
  },
  safeVerify: (token: string) => {
    try {
      const decoded = verify(token, secret);
      const validated = schema.parse(decoded);
      return validated;
    } catch (e) {
      return null;
    }
  },
  isExpired: (createdAt: Date) => createdAt.getTime() + timeout < new Date().getTime(),
  shouldRefresh: (createdAt: Date) => createdAt.getTime() + timeout / 2 < new Date().getTime(),
});

const authTokenSchema = z.object({
  createdAt: z.string().transform((d) => new Date(d)),
  userId: z.string(),
  isAdmin: z.boolean(),
});
const AUTH_TOKEN_TIMEOUT = 30 * 24 * 60 * 60 * 1000;
const authToken = tokenFactory(authTokenSchema, env.JWT_SECRET, AUTH_TOKEN_TIMEOUT);

export const token = {
  auth: authToken,
};

export const tokenSchema = {
  auth: authTokenSchema,
};
