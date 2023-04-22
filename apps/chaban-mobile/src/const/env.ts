import Constants from 'expo-constants';
import { z } from 'zod';

const envSchema = z.object({
  API_URL: z.string(),
  CHABAN_CHANNEL_ID: z.string(),
  CHANNEL: z.string(),
});

export const env = envSchema.parse({
  API_URL: Constants.expoConfig?.extra?.API_URL,
  CHABAN_CHANNEL_ID: Constants.expoConfig?.extra?.CHABAN_CHANNEL_ID,
  CHANNEL: Constants.expoConfig?.extra?.CHANNEL,
});
