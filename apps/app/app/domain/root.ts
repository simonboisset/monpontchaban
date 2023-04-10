import cookie from '~/hooks/cookie';
import { createHandler } from './handler/handler';

export const root = createHandler('root', async ({ request }) => {
  return {
    status: 200,
    data: {
      ENV: {},
      data: cookie.node.get(request.headers.get('Cookie'), 'theme') || 'light',
    },
  };
});
