import { integer, pgEnum, serial, pgTable as table, timestamp, varchar } from "drizzle-orm/pg-core";
import { usersSchema } from "@schemas/users";
import { casesSchema } from "@schemas/cases";

export const documentType = pgEnum("document_types", [
    "other",
])

export const documentsSchema = table("documents", {
    id: serial("id").primaryKey(),
    documentUrl: varchar("document_url"),
    userId: integer("user_id")
        .references(() => usersSchema.id)
        .notNull(),
    documentType: documentType("document_type"),
    caseId: integer("case_id")
        .references(() => casesSchema.id)
        .notNull(),
    createdAt: timestamp("created_at", {withTimezone: true})
        .notNull()
        .defaultNow(),
    updatedAt: timestamp("updated_at", {withTimezone: true})
        .notNull()
        .defaultNow(),

})
