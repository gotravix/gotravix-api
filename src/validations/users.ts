import { BuildSchema, createSchemaFactory } from "drizzle-zod";
import {
    usersSchema,
    clinicsSchema,
    patientsSchema,
} from "@schemas/users";
import z from "zod"
import validateSchemaMw from "@/middlewares/validateSchema";
import { ZodTypeAny } from "zod";
import { createUser } from "@/repository/userRepository";

const { 
    createInsertSchema,
    createUpdateSchema,
    createSelectSchema,
} = createSchemaFactory()

export const createUserValidation = createInsertSchema(usersSchema);
export const updateUserValidation = createUpdateSchema(usersSchema);
export const selectUserValidation = createSelectSchema(usersSchema);

export const updateUserQueryValidation = z.object({
    userId: z.coerce.string(),
})
