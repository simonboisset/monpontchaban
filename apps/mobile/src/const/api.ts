import { createLezoAlertClient } from '@chaban/sdk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { env } from './env';

export const lezoAlertApiClient = createLezoAlertClient(env.API_URL, async () => {
  const token = await AsyncStorage.getItem('token');
  return token;
});
