import { render } from '@react-email/components';
import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import { env } from '../../config/env';

const resend = new Resend(env.RESEND_SECRET);

const scwTransporter = nodemailer.createTransport({
  host: 'smtp.tem.scw.cloud',
  port: 465,
  secure: true,
  auth: {
    user: env.SCALEWAY_API_KEY,
    pass: env.SCALEWAY_SECRET_KEY,
  },
});

type FROM_EMAIL_AVAILABLE = 'notifications@pont-chaban-delmas.com';

type FromMailAddress = {
  name: 'Mon Pont Chaban';
  address: FROM_EMAIL_AVAILABLE;
};
type SendEmailParams = {
  from: FromMailAddress;
  to: string;
  subject: string;
  react: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
};

const sendWithScw = async ({ from, to, subject, react }: SendEmailParams) => {
  const options = { from, to, subject, html: render(react) };
  return scwTransporter.sendMail({ sender: options.from, ...options, encoding: 'utf8' });
};

const sendWithResend = async ({ from, react, subject, to }: SendEmailParams) => {
  const fromAddress = `${from.name} <${from.address}>`;
  await resend.emails.send({ from: fromAddress, to, subject, react });
};

const send = async (params: SendEmailParams) => {
  const domainDestination = params.to.split('@')[1];
  if (domainDestination === 'icloud.com') {
    return sendWithScw(params);
  }
  if (domainDestination === 'laposte.net') {
    return sendWithResend(params);
  }

  return sendWithScw(params);
};
export const email = { send };
