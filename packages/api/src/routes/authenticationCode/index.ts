import { createRouter } from '../../config/api';
import { confirmAuthenticationCode } from './confirmAuthenticationCode';
import { deleteExpiredUserCodes } from './deleteExpiredUserCodes';
import { requestAuthenticationCode } from './requestAuthenticationCode';

export const authenticationCode = createRouter({
  requestAuthenticationCode,
  confirmAuthenticationCode,
  deleteExpiredUserCodes,
});
