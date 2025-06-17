import { relations } from 'drizzle-orm';
import { pgTable as table, varchar, timestamp, serial, boolean, integer, date } from 'drizzle-orm/pg-core';
import { userRole } from "@schemas/roles";

export const usersSchema = table('users', {
    id: serial('id')
            .primaryKey(),
    email: varchar('email', { length: 255 })
            .notNull()
            .unique(),
    username: varchar('username', { length: 64 }),
    password: varchar('password', { length: 255 }).notNull(),
    role: userRole("role"),
    active: boolean('active')
            .notNull()
            .default(false),
    wizard: boolean('wizard')
            .notNull()
            .default(false),
    created_at: timestamp('created_at', { withTimezone: true })
            .notNull()
            .defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true })
            .notNull()
            .defaultNow(),
});


export const patientsSchema = table("patients", {
    userId: integer("user_id")
        .primaryKey()
        .references(() => usersSchema.id, { onDelete: "cascade" }),
    givenName: varchar("given_name", { length: 128 })
        .notNull(),
    middleName: varchar("middle_name", { length: 128 }),
    familyName: varchar("family_name", { length: 128 })
        .notNull(),
    birthDate: date("birth_date")
        .notNull(),
    phoneNumber: varchar("phone_number", { length: 32 }),
    zipCode: varchar("zip_code", { length: 16 }),
    state: varchar("state", { length: 64 }),
    city: varchar("city", { length: 64 }),
    address: varchar("address", { length: 128 }),
    createdAt: timestamp("created_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
})

export const clinicsSchema = table("clinics", {
    userId: integer("user_id")
        .references(() => usersSchema.id)
        .primaryKey(),
    name: varchar("name", { length: 64 })
        .notNull(),
    address: varchar("address", { length: 128 })
        .notNull(),
    contactNumber: varchar("contact_number", { length: 128 })
        .notNull(),
    licenseNumber: varchar("license_number", { length: 32 }),
    createdAt: timestamp("created_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
})

export const lawyersSchema = table("lawyers", {
    userId: integer("user_id")
        .primaryKey()
        .references(() => usersSchema.id),
})


export const clinicsRelations = relations(clinicsSchema, ({one}) => ({
    users: one(usersSchema, {
        fields: [clinicsSchema.userId],
        references: [usersSchema.id],
    })
}))

export const patientsRelations = relations(patientsSchema, ({one}) => ({
    users: one(usersSchema, {
        fields: [patientsSchema.userId],
        references: [usersSchema.id],
    })
}))

export const lawyersRelations = relations(lawyersSchema, ({one}) => ({
    users: one(usersSchema, {
        fields: [lawyersSchema.userId],
        references: [usersSchema.id],
    })
}))

export type User = typeof usersSchema.$inferSelect;
export type NewUser = typeof usersSchema.$inferInsert;
export type Patient = typeof patientsSchema.$inferSelect;
export type NewPatient = typeof patientsSchema.$inferInsert;
export type Clinic = typeof clinicsSchema.$inferSelect;
export type NewClinic = typeof clinicsSchema.$inferInsert;