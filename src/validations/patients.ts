import z from "zod";

// Username: sin espacios, solo letras, números, guion y guion bajo
const usernameRegex = /^[a-zA-Z0-9_-]+$/;

export const patientValidation = z.object({
  userId: z.number({ required_error: "userId is required" }),
  username: z.string({ required_error: "username is required" })
    .min(3, { message: "username must be at least 3 characters" })
    .max(64, { message: "username must be at most 64 characters" })
    .regex(usernameRegex, { message: "username can only contain letters, numbers, hyphens and underscores, no spaces" }),
  givenName: z.string({ required_error: "givenName is required" })
    .trim()
    .min(1, { message: "givenName is required" })
    .max(128, { message: "givenName must be at most 128 characters" }),
  middleName: z.string({ required_error: "middleName is required" })
    .trim()
    .min(1, { message: "middleName is required" })
    .max(128, { message: "middleName must be at most 128 characters" }),
  familyName: z.string({ required_error: "familyName is required" })
    .trim()
    .min(1, { message: "familyName is required" })
    .max(128, { message: "familyName must be at most 128 characters" }),
  birthDate: z.string({ required_error: "birthDate is required" })
    .trim()
    .regex(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/, { message: "birthDate must be YYYY-MM-DD" }),
  phoneNumber: z.string({ required_error: "phoneNumber is required" })
    .trim()
    .min(7, { message: "phoneNumber must be at least 7 digits" })
    .max(32, { message: "phoneNumber must be at most 32 digits" })
    .regex(/^\+?\d+$/, { message: "phoneNumber must contain only digits and may start with +" }),
  zipCode: z.string({ required_error: "zipCode is required" })
    .trim()
    .min(3, { message: "zipCode must be at least 3 digits" })
    .max(16, { message: "zipCode must be at most 16 digits" })
    .regex(/^\d+$/, { message: "zipCode must contain only digits" }),
  state: z.string({ required_error: "state is required" })
    .trim()
    .min(1, { message: "state is required" })
    .max(64, { message: "state must be at most 64 characters" }),
  city: z.string({ required_error: "city is required" })
    .trim()
    .min(1, { message: "city is required" })
    .max(64, { message: "city must be at most 64 characters" }),
  address: z.string({ required_error: "address is required" })
    .trim()
    .min(1, { message: "address is required" })
    .max(128, { message: "address must be at most 128 characters" }),
});
