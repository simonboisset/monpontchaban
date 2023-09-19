const get = (key: string) => {
  if (typeof document === 'undefined') {
    return undefined;
  }
  let cookies: Record<string, string> = {};
  document.cookie.split('; ').forEach((c) => {
    const splitedValue = c.split('=');
    cookies[splitedValue[0]] = splitedValue[1];
  });
  return cookies[key];
};

const set = (key: string, value: string) => {
  if (typeof document === 'undefined') {
    return undefined;
  }
  document.cookie = `${key}=${value}`;
};
const getNode = (cookie: string | null, key: string) => {
  if (!cookie) {
    return undefined;
  }
  let cookies: Record<string, string> = {};
  cookie.split('; ').forEach((c) => {
    const splitedValue = c.split('=');
    cookies[splitedValue[0]] = splitedValue[1];
  });
  return cookies[key];
};
const cookie = { document: { get, set }, node: { get: getNode } };

export default cookie;
