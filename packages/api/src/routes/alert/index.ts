import { createRouter } from '../../config/api';
import { getAlerts } from './getAlerts';
import { getApiData } from './getApiData';

export const alert = createRouter({
  getAlerts,
  getApiData,
});
