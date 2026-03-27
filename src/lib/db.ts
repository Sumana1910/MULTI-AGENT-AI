import { Pool } from 'pg';

export const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'company_db',
  password: 'postgres',
  port: 5432,
});

export async function runQuery(query: string) {
  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error('Database error:', error);
    return [];
  }
}