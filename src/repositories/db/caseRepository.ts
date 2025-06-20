import { db } from '@/config/db';
import { casesSchema } from '@/models/schemas/cases';
import { eq } from 'drizzle-orm';

export const createCase = async (data: any) => {
  const [created] = await db.insert(casesSchema).values(data).returning();
  return created;
};

export const getCaseById = async (id: number) => {
  const result = await db.select().from(casesSchema).where(eq(casesSchema.id, id));
  return result[0];
};

export const getAllCases = async () => {
  return await db.select().from(casesSchema);
};

export const updateCase = async (id: number, data: any) => {
  const [updated] = await db.update(casesSchema).set(data).where(eq(casesSchema.id, id)).returning();
  return updated;
};

export const deleteCase = async (id: number) => {
  const [deleted] = await db.delete(casesSchema).where(eq(casesSchema.id, id)).returning();
  return deleted;
};
