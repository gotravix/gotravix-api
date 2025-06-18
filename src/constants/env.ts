import "dotenv/config";
import { domainRegex } from "@/utils/regexes";
import z from "zod";
import logger from "@/utils/logger";

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

if (!parsed.success) {
    const formattedErrors = Object.entries(parsed.error.format())
        .filter(([key]) => key !== "_")
        .map(([key, value]: [string, any]) => {
            if (value && value._errors && value._errors.length > 0) {
                return `- ${key}: ${value._errors.join(", ")}`;
            }
            return null;
        })
        .filter(Boolean)
        .join("\n");

    logger.error(`❌ Error en variables de entorno requeridas:\n${formattedErrors}`);
    process.exit(1);
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



