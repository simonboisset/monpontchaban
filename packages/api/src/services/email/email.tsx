import { Resend } from 'resend';
import { env } from '../../config/env';

const resend = new Resend(env.RESEND_SECRET);

type FROM_EMAIL_AVAILABLE = 'noreply@lezo.dev' | 'support@lezo.dev';

type SendEmailParams = {
  from: FROM_EMAIL_AVAILABLE;
  to: string;
  subject: string;
  react: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
};

const send = async ({ from, to, subject, react }: SendEmailParams) => {
  return resend.sendEmail({ from, to, subject, react });
};

export const email = { send };
