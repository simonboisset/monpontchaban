import { api, filterNextBridgeEvents } from 'core';

import { createHandler } from '../handler/handler';

export const getSchedules = createHandler('Get Bridge Schedules', async () => {
  const fetchedDatas = await api.get();

  return {
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
    data: fetchedDatas?.filter(filterNextBridgeEvents(new Date())) || [],
    status: 200,
  };
});
