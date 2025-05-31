import dotenv from "dotenv";
dotenv.config();

const getEnv = (key: string, defaultValue?: string): string => {
    const value = process.env[key] || defaultValue;
    if (value === undefined) {
      throw Error(`Missing String environment variable for ${key}`);
    }
    return value;
  };

export const NODE_ENV = getEnv("NODE_ENV", "development");
export const PORT = getEnv("PORT", "4004");
export const APP_ORIGIN = getEnv("APP_ORIGIN");
export const JWT_SECRET = getEnv("JWT_SECRET");
export const JWT_REFRESH_SECRET = getEnv("JWT_REFRESH_SECRET");
export const DATABASE_URL = getEnv("DATABASE_URL");
export const SMTP_HOST = getEnv("SMTP_HOST", "smtp.mailtrap.io");
export const SMTP_PORT = getEnv("SMTP_PORT", "2525");
export const SMTP_USER = getEnv("SMTP_USER", "<usuario_mailtrap>");
export const SMTP_PASS = getEnv("SMTP_PASS", "<password_mailtrap>");
export const SMTP_FROM = getEnv("SMTP_FROM", "no-reply@gotravix.com");