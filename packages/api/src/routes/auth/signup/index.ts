import { createRouter } from '../../../config/api';
import { confirmOtp } from './confirmOtp';
import { sendOtp } from './sendOtp';

export const signup = createRouter({
  confirmOtp,
  sendOtp,
});
