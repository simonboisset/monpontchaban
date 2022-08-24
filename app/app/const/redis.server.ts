import Redis from 'ioredis';

const get = async (key: string) => {
  const { REDIS_URL } = process.env;
  if (REDIS_URL) {
    try {
      const client = new Redis(REDIS_URL);
      const redisData = await client.get(key);
      return redisData;
    } catch (error) {
      console.error('[Redis get] Redis data fails');
    }
  }
  return undefined;
};

const set = async (key: string, value: string) => {
  const { REDIS_URL } = process.env;
  if (REDIS_URL) {
    try {
      const client = new Redis(REDIS_URL);
      await client.set(key, value);
      return true;
    } catch (error) {
      console.error('[Redis set] Save data fails');
    }
  }
  return undefined;
};

export const redis = { get, set };
