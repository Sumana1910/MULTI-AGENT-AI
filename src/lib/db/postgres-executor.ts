import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'company_db',
  password: 'admin',
  port: 5432,
});

export async function executeQuery(sql: string) {
  try {
    console.log("Executing SQL:", sql);
    const result = await pool.query(sql);
    return JSON.stringify(result.rows, null, 2);
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to execute SQL query.');
  }
}