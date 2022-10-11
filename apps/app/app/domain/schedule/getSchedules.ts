import { api, filterNextBridgeEvents } from 'core';
import { redis } from '~/const/redis.server';
import { createHandler } from '../handler/handler';

export const getSchedules = createHandler('Get Bridge Schedules', async () => {
  try {
    const redisData = await redis.get('data');
    if (redisData) {
      const data = JSON.parse(redisData);
      if (Array.isArray(data)) {
        return {
          headers: {
            'Cache-Control': 'public, max-age=3600, s-maxage=86400',
          },
          data: data.filter(filterNextBridgeEvents(new Date())) || [],
          status: 200,
        };
      }
    }
  } catch (error) {
    console.error('[Load data] Redis get data fails');
  }

  const fetchedDatas = await api.get();
  try {
    await redis.set('data', JSON.stringify(fetchedDatas));
  } catch (error) {
    console.error('[Load data] Redis set data fails');
  }
  return {
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
    data: fetchedDatas?.filter(filterNextBridgeEvents(new Date())) || [],
    status: 200,
  };
});
