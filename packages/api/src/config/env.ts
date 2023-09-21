import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']),
  DATABASE_URL: z.string(),
  CRON_SECRET: z.string(),
  SESSION_SECRET: z.string(),
  EXPO_ACCESS_TOKEN: z.string(),
  SCW_SECRET_KEY: z.string(),
  SCW_API_KEY: z.string(),
  SCW_PROJECT_ID: z.string(),
  JWT_SECRET: z.string(),
  RESEND_SECRET: z.string(),
  PORT: z
    .string()
    .transform((value) => parseInt(value, 10))
    .optional(),
});

export type EnvType = z.infer<typeof envSchema>;

export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
  CRON_SECRET: process.env.CRON_SECRET,
  SESSION_SECRET: process.env.SESSION_SECRET,
  EXPO_ACCESS_TOKEN: process.env.EXPO_ACCESS_TOKEN,
  SCW_SECRET_KEY: process.env.SCW_SECRET_KEY,
  SCW_API_KEY: process.env.SCW_API_KEY,
  SCW_PROJECT_ID: process.env.SCW_PROJECT_ID,
  JWT_SECRET: process.env.JWT_SECRET,
  RESEND_SECRET: process.env.RESEND_SECRET,
  PORT: process.env.PORT,
});
