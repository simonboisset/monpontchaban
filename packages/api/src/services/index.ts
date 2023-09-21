import { email } from './email';
import { hash } from './hash';
import { notification } from './notification';
import { payment } from './payment';
import { token } from './token';
import { totp } from './totp';

export const services = { email: email, hash, payment, token, notification, totp };
