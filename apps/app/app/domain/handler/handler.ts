import { json, LoaderFunction, redirect } from '@remix-run/node';
import crypto from 'crypto';
import monitor from 'monitor';
import { getConfig } from '../config/getConfig';
import { createSessionStorage } from './utils/createSessionStorage';

export type Handler<R = any, E = any> = (request: RequestHandler) => Promise<ResponseHandler<R, E>>;

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#client_error_responses
const responseCodes = {
  infos: {
    100: 'Continue',
    101: 'Switching Protocols',
    103: 'Early Hints',
  },
  success: {
    200: 'Ok',
    201: 'Created',
    202: 'Accepted',
    203: 'Non-Authoritative Information',
    204: 'No Content',
    205: 'Reset Content',
    206: 'Partial Content',
  },
  redirection: {
    300: 'Multiple Choices',
    301: 'Moved Permanently',
    302: 'Found',
    303: 'See Other',
    304: 'Not Modified',
    307: 'Temporary Redirect',
    308: 'Permanent Redirect',
  },
  error: {
    400: 'Bad Request',
    401: 'Unauthorized',
    402: 'Payment Required',
    403: 'Forbidden',
    404: 'Not Found',
    405: 'Method Not Allowed',
    406: 'Not Acceptable',
    412: 'Precondition Failed',
    415: 'Unsupported Media Type',
    429: 'Too Many Requests',
    500: 'Internal Server Error',
  },
};

type RequestHandler = {
  params: Record<string, string | undefined>;
  request: Request;
};

type ResponseHandler<R = any, E = any> = {
  data: R | E;
  status: keyof typeof responseCodes['error'] | keyof typeof responseCodes['success'];
  headers?: Record<string, any>;
  redirect?: string;
};

export const chabanMonitor = () => {
  const { KAFKA_PASSWORD, KAFKA_URL, KAFKA_USERNAME, CHANNEL } = getConfig();
  return monitor({
    url: KAFKA_URL,
    username: KAFKA_USERNAME,
    password: KAFKA_PASSWORD,
    topic: 'CHABAN',
    application: 'web app',
    channel: CHANNEL,
    platform: 'NODE',
  });
};

export const createHandler =
  <R = any, E = any>(name: string, handler: Handler<R, E>): LoaderFunction =>
  async ({ params, request }) => {
    let newVisitor: string | undefined = undefined;
    let visitor = await (await createSessionStorage().getSession(request.headers.get('Cookie'))).get('visitor');

    if (!visitor) {
      visitor = crypto.randomUUID();
      newVisitor = await generateVisitorSession(request.headers, visitor);
    }

    chabanMonitor().request(name, visitor, params);
    try {
      const { data, status, headers, redirect: redirectTo } = await handler({ request, params });

      if (redirectTo) {
        return redirect(redirectTo, {
          status,
          headers: newVisitor ? { ...headers, 'Set-Cookie': newVisitor } : headers,
        });
      }
      return json(data, { status, headers: newVisitor ? { ...headers, 'Set-Cookie': newVisitor } : headers });
    } catch (error) {
      chabanMonitor().error(name, error);
      return json(error as E, { status: 500, headers: newVisitor ? { 'Set-Cookie': newVisitor } : undefined });
    }
  };

const generateVisitorSession = async (headers: Headers, id: string) => {
  const cookie = headers.get('Cookie');
  const sessionStore = createSessionStorage();
  const session = await sessionStore.getSession(cookie);
  session.set('visitor', id);
  return sessionStore.commitSession(session);
};
