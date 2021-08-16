export async function waitTo<T, U = Error>(promise: Promise<T>): Promise<[U | null, T | undefined]> {
  try {
    const data = await promise;
    return [null, data];
  } catch (err: any) {
    return [err, undefined];
  }
}
export async function waitSafe<T, U = Error>(promise: Promise<T>, errorMessage?: string): Promise<T> {
  const [err, data] = await waitTo(promise);
  if (err) {
    throw errorMessage ? errorMessage + err : err;
  }
  if (!data) {
    const error = 'No data';
    throw errorMessage ? errorMessage + error : error;
  }
  return data;
}
export function tryTo<T, U = Error>(fct: () => T): [U | null, T | undefined] {
  try {
    const data = fct();
    return [null, data];
  } catch (err: any) {
    return [err, undefined];
  }
}
export function trySafe<T>(fct: () => T, errorMessage?: string): T {
  const [err, data] = tryTo(fct);
  if (err) {
    throw errorMessage ? errorMessage + err : err;
  }
  if (!data) {
    const error = 'No data';
    throw errorMessage ? errorMessage + error : error;
  }
  return data;
}
