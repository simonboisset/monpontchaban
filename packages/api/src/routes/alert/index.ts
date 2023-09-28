import { createRouter } from '../../config/api';
import { getAlerts } from './getAlerts';
import { getStatistics } from './getStatistics';

export const alert = createRouter({
  getAlerts,
  getStatistics,
});
