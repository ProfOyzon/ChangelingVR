import { createTransport } from 'nodemailer';
import { render } from '@react-email/components';

// Create a transporter for the email service
const transporter = createTransport({
  host: 'smtp.dreamhost.com',
  port: 465,
  secure: true,
  auth: {
    user: 'support@changelingvr.com',
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

type Mail = {
  reciever: string;
  subject: string;
  plainText: string;
  email: React.ReactNode;
};

export async function sendMail({
  reciever,
  subject,
  plainText,
  email,
}: Mail): Promise<{ success: boolean; message: string }> {
  try {
    await transporter.sendMail({
      from: 'support@changelingvr.com',
      to: reciever,
      subject,
      text: plainText,
      html: await render(email),
    });

    return { success: true, message: 'Email sent successfully' };
  } catch {
    return { success: false, message: 'Failed to send email' };
  }
}
