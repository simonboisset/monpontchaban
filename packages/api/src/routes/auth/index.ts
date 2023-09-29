import { createRouter } from '../../config/api';
import { login } from './login';

export const auth = createRouter({
  login,
});
