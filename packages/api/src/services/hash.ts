import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const encrypt = (secret: string) => bcrypt.hashSync(secret, 10);
const isValid = (secret: string, hash: string) => bcrypt.compareSync(secret, hash);

const generateUUID = () => {
  const secret = crypto.randomUUID();
  const hash = encrypt(secret);
  return {secret, hash};
};

const generatePinCode = () => {
  const code = crypto.randomInt(100000, 999999).toString();
  const hash = encrypt(code);
  return {code, hash};
};

export const hash = {encrypt, isValid, generateUUID, generatePinCode};
