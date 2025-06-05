import { db } from '@/config/db';
import { activationTokens, ActivationToken, NewActivationToken } from '@/models/schemas/activationToken';
import { eq } from 'drizzle-orm';

export const createActivationToken = async (data: NewActivationToken): Promise<ActivationToken> => {
  const [created] = await db.insert(activationTokens).values(data).returning();
  return created;
};

export const getActivationToken = async (token: string): Promise<ActivationToken | undefined> => {
  const result = await db.select().from(activationTokens).where(eq(activationTokens.token, token));
  return result[0];
};

export const deleteActivationToken = async (token: string): Promise<ActivationToken | undefined> => {
  const [deleted] = await db.delete(activationTokens).where(eq(activationTokens.token, token)).returning();
  return deleted;
};

export const getActivationTokenByUserId = async (userId: number): Promise<ActivationToken | undefined> => {
  const result = await db.select().from(activationTokens).where(eq(activationTokens.user_id, userId));
  return result[0];
};
