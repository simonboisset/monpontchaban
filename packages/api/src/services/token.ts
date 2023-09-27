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

export const token = { auth: tokenFactory(z.object({ deviceId: z.string() })) };
