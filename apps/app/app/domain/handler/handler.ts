import { json, LoaderFunction, redirect } from '@remix-run/node';

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

export const createHandler =
  <R = any, E = any>(name: string, handler: Handler<R, E>): LoaderFunction =>
  async ({ params, request }) => {
    try {
      const { data, status, headers, redirect: redirectTo } = await handler({ request, params });
      if (redirectTo) {
        return redirect(redirectTo, { status, headers });
      }
      return json(data, { status, headers });
    } catch (error) {
      return json(error as E, { status: 500 });
    }
  };
