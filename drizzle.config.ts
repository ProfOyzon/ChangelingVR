import dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';

dotenv.config({ path: '.env.local' });

// Ensure the environment variables are set
if (!process.env.POSTGRES_URL_NON_POOLING) {
  console.error('POSTGRES_URL_NON_POOLING is not set');
  process.exit(1);
}

export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.POSTGRES_URL_NON_POOLING,
  },
  tablesFilter: ['activity_logs', 'cron', 'profile_links', 'profiles', 'reset_tokens', 'members'],
});
