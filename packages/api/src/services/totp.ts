import * as crypto from 'crypto';
// @ts-ignore
import * as base32 from 'thirty-two';

const DEFAULT_ALGORITHM = 'SHA1';
const DEFAULT_DIGITS = 6;
const DEFAULT_WINDOW = 1;
const DEFAULT_PERIOD = 30;

type TOTPConfig = {
  period: number;
  digits: number;
  algorithm: string;
};

function generateHOTP(secret: Buffer, { counter = 0, digits = DEFAULT_DIGITS, algorithm = DEFAULT_ALGORITHM } = {}) {
  const byteCounter = Buffer.from(intToBytes(counter));
  const hmac = crypto.createHmac(algorithm, secret);
  const digest = hmac.update(byteCounter).digest('hex');
  const hashBytes = hexToBytes(digest);
  const offset = hashBytes[19] & 0xf;
  let hotp =
    (((hashBytes[offset] & 0x7f) << 24) |
      ((hashBytes[offset + 1] & 0xff) << 16) |
      ((hashBytes[offset + 2] & 0xff) << 8) |
      (hashBytes[offset + 3] & 0xff)) +
    '';
  return hotp.slice(-digits);
}

function verifyHOTP(
  otp: string,
  secret: Buffer,
  { counter = 0, digits = DEFAULT_DIGITS, algorithm = DEFAULT_ALGORITHM, window = DEFAULT_WINDOW } = {},
) {
  for (let i = counter - window; i <= counter + window; ++i) {
    if (generateHOTP(secret, { counter: i, digits, algorithm }) === otp) {
      return { delta: i - counter };
    }
  }
  return null;
}

function generate({
  period = DEFAULT_PERIOD,
  digits = DEFAULT_DIGITS,
  algorithm = DEFAULT_ALGORITHM,
  secret = base32.encode(crypto.randomBytes(10)).toString(),
}: { secret?: string } & Partial<TOTPConfig> = {}) {
  const otp = generateHOTP(base32.decode(secret), {
    counter: getCounter(period),
    digits,
    algorithm,
  });

  return { otp, secret, period, digits, algorithm };
}

function getUri({
  period,
  digits,
  algorithm,
  secret,
  accountName,
  issuer,
}: {
  secret: string;
  issuer: string;
  accountName: string;
} & TOTPConfig) {
  const params = new URLSearchParams({
    secret,
    issuer,
    algorithm,
    digits: digits.toString(),
    period: period.toString(),
  });

  const escapedIssuer = encodeURIComponent(issuer);
  const escapedAccountName = encodeURIComponent(accountName);
  const label = `${escapedIssuer}:${escapedAccountName}`;

  return `otpauth://totp/${label}?${params.toString()}`;
}

function verify({
  otp,
  secret,
  period,
  digits,
  algorithm,
  window = DEFAULT_WINDOW,
}: {
  otp: string;
  secret: string;
  window?: number;
} & Partial<TOTPConfig>) {
  return verifyHOTP(otp, base32.decode(secret), {
    counter: getCounter(period),
    digits,
    window,
    algorithm,
  });
}

function intToBytes(num: number) {
  const buffer = Buffer.alloc(8);
  buffer.writeBigInt64BE(BigInt(num));
  return [...buffer];
}

function hexToBytes(hex: string) {
  return [...Buffer.from(hex, 'hex')];
}

function getCounter(period: number = DEFAULT_PERIOD) {
  const now = new Date().getTime();
  const counter = Math.floor(now / 1000 / period);
  return counter;
}

export const totp = { generate, getUri, verify };
