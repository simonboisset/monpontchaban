import { createLezoAlertClient } from '@chaban/sdk';
import { getAuthToken } from '../services/secure-store';
import { env } from './env';

export const lezoAlertApiClient = createLezoAlertClient(env.API_URL, async () => {
  const token = await getAuthToken();
  return token;
});
