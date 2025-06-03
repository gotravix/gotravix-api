import { relations } from 'drizzle-orm';
import { pgTable as table, varchar, timestamp, serial, boolean, integer, date } from 'drizzle-orm/pg-core';

export const users = table('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  active: boolean('active').notNull().default(false),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});


export const patients = table("patients", {
    userId: integer("user_id")
        .primaryKey()
        .references(() => users.id),
    givenName: varchar("given_name", { length: 128 })
        .notNull(),
    middleName: varchar("middle_name", { length: 128 }),
    familyName: varchar("family_name", { length: 128 })
        .notNull(),
    birthDate: date("birth_date")
        .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
})

export const clinics = table("clinics", {
    userId: integer("user_id")
        .references(() => users.id)
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


export const clinicsRelations = relations(clinics, ({one}) => ({
    users: one(users, {
        fields: [clinics.userId],
        references: [users.id],
    })
}))

export const patientsRelations = relations(patients, ({one}) => ({
    users: one(users, {
        fields: [patients.userId],
        references: [users.id],
    })
}))

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Patient = typeof patients.$inferSelect;
export type NewPatient = typeof patients.$inferInsert;
export type Clinic = typeof clinics.$inferSelect;
export type NewClinic = typeof clinics.$inferInsert;