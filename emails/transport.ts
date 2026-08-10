import { render } from 'react-email';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.dreamhost.com',
  port: 465,
  secure: true,
  auth: {
    user: 'support@changelingvr.com',
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

type MailProps = {
  to: string;
  subject: string;
  plainText: string;
  html: React.ReactNode;
};

export async function sendMail({ to, subject, plainText, html }: MailProps) {
  const emailHtml = await render(html);
  await transporter.sendMail({
    from: 'support@changelingvr.com',
    to,
    subject,
    text: plainText,
    html: emailHtml,
  });
}
