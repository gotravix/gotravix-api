import { db } from '../config/db';
import { clinicsSchema, Clinic, NewClinic } from '../models/schemas/users';
import { eq } from 'drizzle-orm';

export const getClinicByUserId = async (userId: number): Promise<Clinic | undefined> => {
  const result = await db.select().from(clinicsSchema).where(eq(clinicsSchema.userId, userId));
  return result[0];
};

export const createClinic = async (clinic: NewClinic): Promise<Clinic> => {
  const [created] = await db.insert(clinicsSchema).values(clinic).returning();
  return created;
};

export const updateClinic = async (userId: number, data: Partial<NewClinic>): Promise<Clinic | undefined> => {
  const [updated] = await db.update(clinicsSchema).set(data).where(eq(clinicsSchema.userId, userId)).returning();
  return updated;
};

export const deleteClinic = async (userId: number): Promise<Clinic | undefined> => {
  const [deleted] = await db.delete(clinicsSchema).where(eq(clinicsSchema.userId, userId)).returning();
  return deleted;
};
