import { DATABASE_URL } from '../constants/env';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

export const pool = new Pool({ connectionString: DATABASE_URL });
export const db = drizzle(pool);

