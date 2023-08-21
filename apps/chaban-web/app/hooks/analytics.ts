const PIPE_NAME = 'average_calls_per_ip_api';

async function getTopFunctions(date_from?: string, date_to?: string): Promise<TopFunctions> {
  const { data } = await queryPipe<TopFunctionsQueryData>(PIPE_NAME, {
    date_from,
    date_to,
  });

  const topFunctions = data
    .map(({ function_name, total }) => ({
      name: function_name,
      value: total,
    }))
    .sort((a, b) => b.value - a.value);

  return topFunctions;
}
async function getAverageCallsPerIP(date_from?: string, date_to?: string): Promise<AverageCallsPerIP> {
  const { data } = await queryPipe<AverageCallsPerIPQueryData>(PIPE_NAME, {
    date_from,
    date_to,
  });

  const averageCallsPerIP = data[0].average;

  return averageCallsPerIP;
}

export async function client<T>(path: string, params?: RequestInit): Promise<ClientResponse<T>> {
  const { host, token } = getConfig();

  if (!token || !host) throw new Error('Configuration not found');

  const apiUrl =
    {
      'https://ui.tinybird.co': 'https://api.tinybird.co',
      'https://ui.us-east.tinybird.co': 'https://api.us-east.tinybird.co',
    }[host] ?? host;

  const response = await fetch(`${apiUrl}/v0${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    ...params,
  });
  const data = (await response.json()) as ClientResponse<T>;

  if (!response.ok) {
    throw new QueryError(data?.error ?? 'Something went wrong', response.status);
  }
  return data;
}


export function querySQL<T>(sql: string): Promise<QuerySQL<T>> {
  return client(`/sql?q=${sql}`);
}
