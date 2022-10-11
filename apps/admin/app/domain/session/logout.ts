import { createSessionStorage } from './utils/createSessionStorage';

export async function logout(request: Request): Promise<ResponseInit> {
  const cookie = request.headers.get('Cookie');
  const sessionStore = createSessionStorage();
  const session = await sessionStore.getSession(cookie);
  const nextCookie = await sessionStore.destroySession(session);
  return { headers: { 'Set-Cookie': nextCookie } };
}

export default logout;
