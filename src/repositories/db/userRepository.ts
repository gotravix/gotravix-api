import { db } from '@/config/db';
import { usersSchema, User, NewUser } from '@/models/schemas/users';
import { eq } from 'drizzle-orm';

export const getAllUsers = async (): Promise<User[]> => {
  return await db.select().from(usersSchema);
};

export const getUserById = async (id: number): Promise<User | undefined> => {
  const result = await db.select().from(usersSchema).where(eq(usersSchema.id, id));
  return result[0];
};

export const createUser = async (user: NewUser): Promise<User> => {
  const [created] = await db.insert(usersSchema).values(user).returning();
  return created;
};

export const updateUser = async (id: number, data: Partial<NewUser>, tx?: any): Promise<User | undefined> => {
  const executor = tx || db;
  const [updated] = await executor.update(usersSchema).set(data).where(eq(usersSchema.id, id)).returning();
  return updated;
};

export const deleteUser = async (id: number): Promise<User | undefined> => {
  const [deleted] = await db.delete(usersSchema).where(eq(usersSchema.id, id)).returning();
  return deleted;
};

export const getUserByEmail = async (email: string, withPassword = false): Promise<User | Omit<User, 'password'> | undefined> => {
  const result = await db.select().from(usersSchema).where(eq(usersSchema.email, email));
  if (result[0]) {
    if (withPassword) {
      return result[0];
    } else {
      const { password, ...rest } = result[0];
      return rest;
    }
  }
  return undefined;
};

export const getUserByUsername = async (username: string): Promise<User | undefined> => {
  const result = await db.select().from(usersSchema).where(eq(usersSchema.username, username));
  return result[0];
};
