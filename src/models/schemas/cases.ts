import { integer, serial, pgTable as table, timestamp, varchar } from "drizzle-orm/pg-core";
import { clinicsSchema, lawyersSchema, patientsSchema, usersSchema } from "@schemas/users";
export const casesSchema = table("case", {
    id: serial("id")
        .primaryKey(),
    title: varchar("title", { length: 52 })
        .notNull(),
    patientId: integer("patient_id")
        .notNull()
        .references(() => patientsSchema.userId),
    clinicId: integer("clinic_id")
        .references(() => clinicsSchema.userId),
    lawyerId: integer("lawyer_id")
        .references(() => lawyersSchema.userId),
    description: varchar("description")
        .notNull(),
    createdAt: timestamp("created_at", {withTimezone: true})
        .notNull()
        .defaultNow(),
    updatedAt: timestamp("updated_at", {withTimezone: true})
        .notNull()
        .defaultNow(), 

})
