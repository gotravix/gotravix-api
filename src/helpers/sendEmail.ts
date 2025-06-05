import nodemailer from "nodemailer";
import { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } from "@/constants/env";

// Configura aquí tu transporte SMTP (puedes usar Mailtrap, Gmail, etc.)
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: true, 
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  const mailOptions = {
    from: SMTP_FROM,
    to,
    subject,
    html
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully!');
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
};
