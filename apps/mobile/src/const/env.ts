import Constants from 'expo-constants';
import { z } from 'zod';

const envSchema = z.object({
  API_URL: z.string(),
  APP_VERSION: z.string(),
});

export const env = envSchema.parse({
  API_URL: Constants.expoConfig?.extra?.API_URL,
  APP_VERSION: Constants.expoConfig?.extra?.APP_VERSION,
});
