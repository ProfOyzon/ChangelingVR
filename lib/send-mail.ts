import { transporter } from './nodemailer';

/**
 * Send an email
 */
export async function sendMail({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text: string;
  html: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    await transporter.sendMail({
      from: 'support@changelingvr.com',
      to,
      subject,
      text,
      html,
    });

    return { success: true, message: 'Email sent successfully' };
  } catch {
    return { success: false, message: 'Failed to send email' };
  }
}
