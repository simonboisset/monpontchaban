import { useCallback, useState } from 'react';

type Await<T> = T extends PromiseLike<infer U> ? { 0: Await<U>; 1: U }[U extends PromiseLike<any> ? 0 : 1] : T;
type QueryStatus = 'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR';

// const wait = (ms: number = 2000) => {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// };
type StatusCode = 400 | 403 | 404 | 410 | 422 | 500;

type CloudError = {
  statusCode: StatusCode;
  code: string;
  message?: string;
  errors?: Object;
};

export const useQuery = <T extends (...params: any[]) => Promise<any>>(
  query: T,
  onSuccess?: (data: Await<ReturnType<T>>) => void
) => {
  const [data, setData] = useState<Await<ReturnType<T>>>();
  const [status, setStatus] = useState<QueryStatus>('IDLE');
  const [error, setError] = useState<CloudError>();

  const call = useCallback(
    async (...params: Parameters<T>) => {
      setStatus('LOADING');
      // await wait();
      try {
        const res = await query(...params);

        setData(res);
        setError(undefined);
        setStatus('SUCCESS');

        if (!!onSuccess) {
          onSuccess(res);
        }
      } catch (err) {
        setError(err);
        setStatus('ERROR');
        setData(undefined);
      }
    },
    [query, onSuccess]
  );
  const isLoading = status === 'LOADING';
  return { data, status, query: call, error, isLoading, setData };
};
