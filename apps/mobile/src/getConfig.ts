import Constants from 'expo-constants';
const getVariables = <T extends string>(...variableNames: T[]): Record<T, string> => {
  let variables = {} as Record<T, string>;
  for (const name of variableNames) {
    const value = Constants.expoConfig?.extra?.[name];
    if (!value || typeof value !== 'string') {
      throw new Error(`[Config] ${name} is not defined`);
    }
    variables[name] = value;
  }
  return variables;
};

export const getConfig = () => getVariables('CHANNEL', 'KAFKA_URL', 'KAFKA_USERNAME', 'KAFKA_PASSWORD');
