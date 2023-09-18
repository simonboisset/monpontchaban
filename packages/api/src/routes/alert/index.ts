import { createRouter } from '../../config/api';
import { getAlerts } from './getAlerts';
import { getApiData } from './getApiData';
import { getStatistics } from './getStatistics';

export const alert = createRouter({
  getAlerts,
  getApiData,
  getStatistics,
});
