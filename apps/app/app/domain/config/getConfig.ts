const getVariables = <T extends string>(...variableNames: T[]): Record<T, string> => {
  let variables = {} as Record<T, string>;
  for (const name of variableNames) {
    const value = process.env[name];
    if (!value || typeof value !== 'string') {
      throw new Error(`[Config] ${name} is not defined`);
    }
    variables[name] = value;
  }
  return variables;
};

export const getConfig = () =>
  getVariables(
    'DATABASE_URL',
    'CHANNEL',
    'SESSION_SECRET',
    'SEND_NOTIFICATION_TOKEN',
    'EXPO_ACCESS_TOKEN',
    'TZ',
    'MY_PUSH_TOKEN',
    'KAFKA_URL',
    'KAFKA_USERNAME',
    'KAFKA_PASSWORD',
  );
