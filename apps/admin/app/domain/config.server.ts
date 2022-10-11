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

export const config = () => getVariables('ADMIN_USERNAME', 'ADMIN_PASSWORD', 'JWT_TOKEN', 'SESSION_SECRET');
