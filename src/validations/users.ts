import { createSchemaFactory } from "drizzle-zod";
import { usersSchema } from "@schemas/users";
import z from "zod";

const { createInsertSchema, createUpdateSchema, createSelectSchema } =
  createSchemaFactory();

export const createUserValidation = createInsertSchema(usersSchema);
export const updateUserValidation = createUpdateSchema(usersSchema);
export const selectUserValidation = createSelectSchema(usersSchema);

export const UserIdValidation = z.object({
  id: z.string({ required_error: "User ID is required" })
    .min(1, { message: "User ID is required" })
    .regex(/^\d+$/, { message: "User ID must be a numeric string" })
});