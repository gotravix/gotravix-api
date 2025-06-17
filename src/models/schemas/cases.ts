import { integer, serial, pgTable as table, timestamp, varchar } from "drizzle-orm/pg-core"
import { clinicsSchema, lawyersSchema, patientsSchema, usersSchema } from "@schemas/users"
export const casesSchema = table("case", {
    id: serial("id")
        .primaryKey(),
    title: varchar("title", { length: 52 })
        .notNull(),
    patientId: integer("patient_id")
        .notNull()
        .references(() => patientsSchema.userId),
    description: varchar("description")
        .notNull(),
    createdAt: timestamp("created_at", {withTimezone: true})
        .notNull()
        .defaultNow(),
    updatedAt: timestamp("updated_at", {withTimezone: true})
        .notNull()
        .defaultNow(), 

})

export const casesUsersSchema = table("cases_users", {
    caseId: integer("case_id")
        .notNull()
        .references(() => casesSchema.id),
    patientId: integer("patient_id")
        .notNull()
        .references(() => patientsSchema.userId),
    lawyerId: integer("lawyer_id")
        .references(() => lawyersSchema.userId),
    clinicId: integer("clinic_id")
        .references(() => clinicsSchema.userId),
    createdAt: timestamp("created_at", {withTimezone: true})
        .notNull()
        .defaultNow(),
    
})