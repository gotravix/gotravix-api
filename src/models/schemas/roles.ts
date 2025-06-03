import { pgEnum } from "drizzle-orm/pg-core";

export const userRole = pgEnum("user_roles", [
    "patient",
    "clinic",
    "lawyer",
    "marketer",
    "admin",
    "guest",
])