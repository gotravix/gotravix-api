import { db } from '../config/db';
import { patientsSchema, Patient, NewPatient } from '../models/schemas/users';
import { eq } from 'drizzle-orm';

export const getPatientByUserId = async (userId: number): Promise<Patient | undefined> => {
  const result = await db.select().from(patientsSchema).where(eq(patientsSchema.userId, userId));
  return result[0];
};

export const createPatient = async (patient: NewPatient): Promise<Patient> => {
  const [created] = await db.insert(patientsSchema).values(patient).returning();
  return created;
};

export const updatePatient = async (userId: number, data: Partial<NewPatient>): Promise<Patient | undefined> => {
  const [updated] = await db.update(patientsSchema).set(data).where(eq(patientsSchema.userId, userId)).returning();
  return updated;
};

export const deletePatient = async (userId: number): Promise<Patient | undefined> => {
  const [deleted] = await db.delete(patientsSchema).where(eq(patientsSchema.userId, userId)).returning();
  return deleted;
};
