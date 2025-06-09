import z from "zod";
import { userRole } from "../models/schemas/roles";

const allowedRoles = userRole.enumValues;

export const registerValidation = z.object({
  email: z
    .string()
    .email({ message: "Email is required" })
    .refine(val => val.trim().length > 0, { message: "Email is required" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters" })
    .refine(val => val.trim().length > 0, { message: "Password is required" })
    .refine(val => /[A-Z]/.test(val), { message: "Password must contain at least one uppercase letter" })
    .refine(val => /[a-z]/.test(val), { message: "Password must contain at least one lowercase letter" })
    .refine(val => /[0-9]/.test(val), { message: "Password must contain at least one number" })
    .refine(val => /[^A-Za-z0-9]/.test(val), { message: "Password must contain at least one special character" }),
  role: z
    .string()
    .min(1, { message: "Role is required" })
    .refine(val => val.trim().length > 0, { message: "Role is required" })
    .refine(val => allowedRoles.includes(val as typeof allowedRoles[number]), { message: "Role is invalid" })
});

export const loginValidation = z.object({
  email: z
    .string()
    .email({ message: "Invalid email format" })
    .refine((val) => val.trim().length > 0, { message: "Email is required" }),
  password: z
    .string({ required_error: "Password is required" })
    .refine((val) => val.trim().length > 0, { message: "Password is required" }),
});

export const activateValidation = z.object({
  token: z.string({ required_error: "Token is required" }).length(64, { message: "Token must be a 64-character string" })
});