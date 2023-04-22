import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']),
  DATABASE_URL: z.string(),
  CRON_SECRET: z.string(),
  SESSION_SECRET: z.string(),
  EXPO_ACCESS_TOKEN: z.string(),
  RESEND_SECRET: z.string(),
  JWT_SECRET: z.string(),
  CHABAN_CHANNEL_ID: z.string(),
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
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  EXPO_ACCESS_TOKEN: process.env.EXPO_ACCESS_TOKEN,
  RESEND_SECRET: process.env.RESEND_SECRET,
  JWT_SECRET: process.env.JWT_SECRET,
  CHABAN_CHANNEL_ID: process.env.CHABAN_CHANNEL_ID,
  PORT: process.env.PORT,
});
