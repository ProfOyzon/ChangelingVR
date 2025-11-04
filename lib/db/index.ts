import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@/drizzle/schema';

config({ path: '.env.local' });

if (!process.env.POSTGRES_URL) {
  console.error('POSTGRES_URL is not set');
  process.exit(1);
}

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(process.env.POSTGRES_URL, { prepare: false });
export const db = drizzle(client, { schema });
