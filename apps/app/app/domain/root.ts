import cookie from '~/hooks/cookie';
import { getConfig } from './config/getConfig';
import { createHandler } from './handler/handler';

export const root = createHandler('root', async ({ request }) => {
  const { KAFKA_PASSWORD, KAFKA_URL, KAFKA_USERNAME } = getConfig();
  return {
    status: 200,
    data: {
      ENV: { KAFKA_PASSWORD, KAFKA_URL, KAFKA_USERNAME },
      data: cookie.node.get(request.headers.get('Cookie'), 'theme') || 'light',
    },
  };
});
