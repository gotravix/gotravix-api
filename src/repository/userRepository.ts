import { db } from '../config/db';
import { users, User, NewUser } from '../models/schemas/user';
import { eq } from 'drizzle-orm';

export const getAllUsers = async (): Promise<User[]> => {
  return await db.select().from(users);
};

export const getUserById = async (id: number): Promise<User | undefined> => {
  const result = await db.select().from(users).where(eq(users.id, id));
  return result[0];
};

export const createUser = async (user: NewUser): Promise<User> => {
  const [created] = await db.insert(users).values(user).returning();
  return created;
};

export const updateUser = async (id: number, data: Partial<NewUser>): Promise<User | undefined> => {
  const [updated] = await db.update(users).set(data).where(eq(users.id, id)).returning();
  return updated;
};

export const deleteUser = async (id: number): Promise<User | undefined> => {
  const [deleted] = await db.delete(users).where(eq(users.id, id)).returning();
  return deleted;
};

export const getUserByEmail = async (email: string): Promise<Omit<User, 'password'> | undefined> => {
  const result = await db.select().from(users).where(eq(users.email, email));
  if (result[0]) {
    const { password, ...rest } = result[0];
    return rest;
  }
  return undefined;
};
