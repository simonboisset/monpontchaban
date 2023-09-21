import { createRouter } from '../../config/api';
import { deleteExpiredUserCodes } from './deleteExpiredUserCodes';
import { getCurrentUser } from './getCurrentUser';
import { login } from './login';
import { signup } from './signup';

export const auth = createRouter({
  getCurrentUser,
  deleteExpiredUserCodes,
  login,
  signup,
});
