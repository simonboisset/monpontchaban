import type { ApiRouter } from '@chaban/api';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider, Persister } from '@tanstack/react-query-persist-client';
import { httpBatchLink } from '@trpc/react';
import { createTRPCReact, getQueryKey } from '@trpc/react-query';
import React, { ReactNode } from 'react';
import superjson from 'superjson';

export const lezoAlertApi = createTRPCReact<ApiRouter>();
export const lezoAlertQueryClient = new QueryClient({});

type QueryProviderProp = {
  children: ReactNode;
  client: SdkClient;
  persister?: Persister;
};

export const LezoAlertSdkProvider = ({ children, client, persister }: QueryProviderProp) => {
  if (!persister) {
    return (
      <lezoAlertApi.Provider client={client} queryClient={lezoAlertQueryClient}>
        <QueryClientProvider client={lezoAlertQueryClient}>
          <>{children}</>
        </QueryClientProvider>
      </lezoAlertApi.Provider>
    );
  }
  return (
    <lezoAlertApi.Provider client={client} queryClient={lezoAlertQueryClient}>
      <PersistQueryClientProvider client={lezoAlertQueryClient} persistOptions={{ persister }}>
        <>{children}</>
      </PersistQueryClientProvider>
    </lezoAlertApi.Provider>
  );
};

export const createLezoAlertClient = (host: string, geToken: () => Promise<string | null | undefined>) => {
  const getHeader = async () => {
    const token = await geToken();

    if (!token) {
      return {};
    }

    if (!token || typeof token !== 'string') {
      return {};
    }
    return { Authorization: token };
  };

  return lezoAlertApi.createClient({
    links: [
      httpBatchLink({
        url: `${host}/api`,
        headers: () => getHeader(),
      }),
    ],
    transformer: superjson,
  });
};
export type SdkClient = ReturnType<typeof createLezoAlertClient>;

export { getQueryKey, useQueryClient };
