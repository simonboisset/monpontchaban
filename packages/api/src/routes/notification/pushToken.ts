import Expo from 'expo-server-sdk';
import { z } from 'zod';

export const pushTokenSchema = z.custom<string>((data) => Expo.isExpoPushToken(data));
