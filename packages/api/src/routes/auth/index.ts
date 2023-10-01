import { createRouter } from '../../config/api';
import { confirmLogin } from './confirmLogin';
import { deleteAccount } from './deleteAccount';
import { getCurrentDevice } from './getCurrentDevice';
import { requestLogin } from './requestLogin';

export const auth = createRouter({
  requestLogin,
  confirmLogin,
  getCurrentDevice,
  deleteAccount,
});
