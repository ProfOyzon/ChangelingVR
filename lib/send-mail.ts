import { render } from '@react-email/components';
import { transporter } from './nodemailer';

/**
 * Send an email
 */
export async function sendMail({
  reciever,
  subject,
  plainText,
  email,
}: {
  reciever: string;
  subject: string;
  plainText: string;
  email: React.ReactNode;
}): Promise<{ success: boolean; message: string }> {
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
