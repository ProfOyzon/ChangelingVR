import { createTransport } from 'nodemailer';

// Create a transporter for the email service
export const transporter = createTransport({
  host: 'smtp.dreamhost.com',
  port: 465,
  secure: true,
  auth: {
    user: 'support@changelingvr.com',
    pass: process.env.NODEMAILER_PASSWORD,
  },
});
