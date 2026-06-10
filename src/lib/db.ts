import { Pool } from 'pg';

let pool: Pool;

if (process.env.NODE_ENV === 'production') {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
} else {
  // In development, use a global variable to preserve the Pool
  // across module reloads caused by Next.js Hot Module Replacement (HMR).
  if (!(global as any).pgPool) {
    (global as any).pgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }
  pool = (global as any).pgPool;
}

export const query = (text: string, params?: any[]) => pool.query(text, params);
export default pool;
