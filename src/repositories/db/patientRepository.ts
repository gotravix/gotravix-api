import { db } from '@/config/db';
import { patientsSchema, Patient, NewPatient } from '@/models/schemas/users';
import { updateUser } from './userRepository';
import { eq } from 'drizzle-orm';

export const getPatientByUserId = async (userId: number): Promise<Patient | undefined> => {
  const result = await db.select().from(patientsSchema).where(eq(patientsSchema.userId, userId));
  return result[0];
};

export const createPatient = async (patient: NewPatient, tx?: any): Promise<Patient> => {
  const executor = tx || db;
  const [created] = await executor.insert(patientsSchema).values(patient).returning();
  return created;
};

export const updatePatient = async (userId: number, data: any, tx?: any): Promise<Patient | undefined> => {
  const executor = tx || db;
  // Actualiza usuario si hay datos relevantes
  if (data.username || data.email || data.wizard || data.active) {
    await updateUser(userId, {
      username: data.username,
      email: data.email,
      wizard: data.wizard,
      active: data.active,
      updated_at: new Date(),
    }, executor);
  }
  // Actualiza paciente con el resto de los datos
  const patientFields = { ...data };
  delete patientFields.username;
  delete patientFields.email;
  delete patientFields.wizard;
  delete patientFields.active;
  const [updated] = await executor.update(patientsSchema).set(patientFields).where(eq(patientsSchema.userId, userId)).returning();
  return updated;
};

export const deletePatient = async (userId: number): Promise<Patient | undefined> => {
  const [deleted] = await db.delete(patientsSchema).where(eq(patientsSchema.userId, userId)).returning();
  return deleted;
};
