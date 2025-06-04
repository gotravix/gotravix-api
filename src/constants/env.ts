import "dotenv/config";
import { domainRegex } from "@/utils/regexes";
import z from "zod";

const envSchema = z
    .object({
        NODE_ENV: z
            .union([
                z.literal("development"), 
                z.literal("production")
            ])
            .default("development"),
        APP_PORT: z
            .coerce
            .number()
            .min(0)
            .max(65345)
            .default(4004),
        APP_ORIGIN: z
            .string()
            .url(),
        JWT_SECRET: z.string(),
        JWT_REFRESH_SECRET: z.string(),
        DATABASE_URL: z
            .string()
            .url(),
        SMTP_HOST: z
            .string()
            .regex(domainRegex)
            .default("smtp.mailtrap.io"),
        SMTP_PORT: z
            .coerce
            .number()
            .min(0)
            .max(65435)
            .default(2525),
        SMTP_USER: z
            .string()
            .default("<usuario_mailtrap>"),
        SMTP_PASS: z
            .string()
            .default("<password_mailtrap>"),
        SMTP_FROM: z
            .string()
            .default("no-reply@gotravix.com"),
});

const parsed = envSchema.safeParse(process.env);

if (parsed.error) {
    throw parsed.error;
}
export const {
    NODE_ENV,
    APP_PORT,
    APP_ORIGIN,
    JWT_SECRET,
    JWT_REFRESH_SECRET,
    DATABASE_URL,
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    SMTP_FROM,
} = parsed.data;



