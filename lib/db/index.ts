import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import { relations } from '@/drizzle/relations';

config({ path: '.env.local' });

if (!process.env.POSTGRES_URL) {
  console.error('POSTGRES_URL is not set');
  process.exit(1);
}

export const db = drizzle(process.env.POSTGRES_URL, { relations });
