import Constants from 'expo-constants';
import { z } from 'zod';

const envSchema = z.object({
  API_URL: z.string(),
  CHABAN_CHANNEL_ID: z.string(),
  APP_VERSION: z.string(),
});

export const env = envSchema.parse({
  API_URL: Constants.expoConfig?.extra?.API_URL,
  CHABAN_CHANNEL_ID: Constants.expoConfig?.extra?.CHABAN_CHANNEL_ID,
  APP_VERSION: Constants.expoConfig?.extra?.APP_VERSION,
});
