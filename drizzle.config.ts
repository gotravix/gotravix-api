import { defineConfig } from "drizzle-kit";
import { DATABASE_URL } from './src/constants/env';

export default defineConfig({
  dialect: 'postgresql', // 'mysql' | 'sqlite' | 'turso'
  schema: './src/models/schemas',
  out: './migrations',
  dbCredentials: {
   url: DATABASE_URL,
  },
})
